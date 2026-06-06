import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// ─── Era metadata ─────────────────────────────────────────────────────────────

const ERA_META = {
  'origin':      { label: 'ORIGIN',       color: '#7A8FA6', desc: 'Mark I–III · Cave to workshop' },
  'development': { label: 'DEVELOPMENT',  color: '#C0392B', desc: 'Mark IV–VII · Iterative refinement' },
  'avengers':    { label: 'AVENGERS',     color: '#00D4FF', desc: 'The assembly era' },
  'legion':      { label: 'LEGION',       color: '#FFB800', desc: 'House Party Protocol · 42 suits' },
  'variants':    { label: 'VARIANTS',     color: '#A855F7', desc: 'Specialized configurations' },
  'endgame':     { label: 'ENDGAME',      color: '#00FF88', desc: 'The final chapter' },
  'comics':      { label: 'COMICS',       color: '#FFD45C', desc: 'Page-canon exclusives' },
}

const ERA_PRIORITY = ['origin', 'development', 'avengers', 'legion', 'variants', 'endgame', 'comics']

// ─── SuitPod ──────────────────────────────────────────────────────────────────

function SuitPod({ suit, index, accentColor, compareMode, isSelected, onToggleSelect }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (compareMode) {
      onToggleSelect(suit.id)
    } else {
      navigate(`/armory/${suit.id}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.4), duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className="flex-shrink-0 cursor-pointer rounded overflow-hidden relative select-none"
      style={{
        width: 96,
        border: isSelected
          ? `2px solid ${accentColor}`
          : `1px solid ${accentColor}28`,
        background: 'rgba(10,13,20,0.85)',
        boxShadow: isSelected ? `0 0 18px ${accentColor}40` : 'none',
      }}
    >
      {/* Accent top stripe */}
      <div
        className="h-0.5 w-full"
        style={{ background: accentColor }}
      />

      {/* Suit image */}
      <div
        className="relative"
        style={{
          height: 110,
          background: `linear-gradient(160deg, ${suit.color_primary}18, transparent 70%)`,
        }}
      >
        <img
          src={suit.image_path}
          alt={suit.designation}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ padding: '10px' }}
          onError={e => { e.target.style.opacity = '0' }}
        />

        {/* Status dot */}
        <div
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style={{
            background: suit.status === 'active'
              ? '#00FF88'
              : suit.status === 'retired'
              ? '#FFB800'
              : '#FF4444',
          }}
        />

        {/* Compare checkmark */}
        {isSelected && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `${accentColor}18` }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: accentColor, color: '#080D16' }}
            >
              ✓
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2 py-1.5">
        <p
          className="font-display text-[10px] font-bold tracking-wide leading-tight truncate"
          style={{ color: accentColor }}
        >
          {suit.designation}
        </p>
        <p className="font-mono-ui text-[8px] text-text-secondary mt-0.5 truncate leading-tight">
          {suit.nickname}
        </p>
        {suit.year_built_canonical && (
          <p className="font-mono-ui text-[7px] mt-1 opacity-35 text-text-secondary">
            {suit.year_built_canonical}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── PulseTrace ───────────────────────────────────────────────────────────────

function PulseTrace({ color }) {
  return (
    <div className="relative h-[1px] mb-5 overflow-hidden rounded-full" style={{ background: `${color}18` }}>
      <motion.div
        className="absolute top-0 h-full rounded-full"
        style={{ width: 80, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ x: ['-80px', '100vw'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// ─── TimelineView ─────────────────────────────────────────────────────────────

export default function TimelineView({ suits, compareMode = false, selectedIds = [], onToggleSelect }) {
  const grouped = useMemo(() => {
    const g = {}
    suits.forEach(suit => {
      const era = suit.era ?? 'unknown'
      if (!g[era]) g[era] = []
      g[era].push(suit)
    })
    Object.values(g).forEach(arr =>
      arr.sort((a, b) => (a.year_built_canonical ?? 9999) - (b.year_built_canonical ?? 9999))
    )
    return g
  }, [suits])

  const orderedEras = useMemo(() => {
    const known = ERA_PRIORITY.filter(e => grouped[e]?.length)
    const unknown = Object.keys(grouped).filter(e => !ERA_PRIORITY.includes(e))
    return [...known, ...unknown]
  }, [grouped])

  if (suits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="font-mono-ui text-text-secondary text-xs tracking-wider">
          NO SUITS MATCH CURRENT FILTERS
        </p>
      </div>
    )
  }

  return (
    <div className="py-8 px-6 pb-24 space-y-10">
      {orderedEras.map((era, ei) => {
        const meta  = ERA_META[era] ?? { label: era.toUpperCase(), color: '#00D4FF', desc: '' }
        const group = grouped[era]

        return (
          <motion.section
            key={era}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ei * 0.06, duration: 0.4, ease: 'easeOut' }}
          >
            {/* Era header */}
            <div className="flex items-center gap-3 mb-3">
              {/* Arc reactor indicator */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}` }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{ background: meta.color }}
                />
              </div>

              <div>
                <p
                  className="font-display text-xs font-bold tracking-widest leading-tight"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </p>
                <p className="font-mono-ui text-[8px] text-text-secondary tracking-wider opacity-60">
                  {meta.desc}
                </p>
              </div>

              <div
                className="flex-1 h-px"
                style={{ background: `linear-gradient(90deg, ${meta.color}50, transparent)` }}
              />

              <p className="font-mono-ui text-[8px] text-text-secondary tracking-wider opacity-50">
                {group.length} SUIT{group.length !== 1 ? 'S' : ''}
              </p>
            </div>

            {/* Pulse scan trace */}
            <PulseTrace color={meta.color} />

            {/* Suit pod strip — horizontal scroll */}
            <div
              className="flex gap-3 overflow-x-auto"
              style={{
                paddingBottom: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: `${meta.color}30 transparent`,
              }}
            >
              {group.map((suit, si) => (
                <SuitPod
                  key={suit.id}
                  suit={suit}
                  index={si}
                  accentColor={meta.color}
                  compareMode={compareMode}
                  isSelected={selectedIds.includes(suit.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
