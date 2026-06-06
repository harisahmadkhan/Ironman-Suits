import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import EraTag from '@/components/ui/EraTag'
import ScopeBadge from '@/components/ui/ScopeBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { cardVariants } from '@/lib/motion'

function CapChip({ label }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 font-mono-ui text-[9px] tracking-wider uppercase text-text-secondary rounded-sm"
      style={{ border: '1px solid rgba(0,212,255,0.14)', background: 'rgba(0,212,255,0.04)' }}>
      {label}
    </span>
  )
}

export default function SuitCard({ suit, compareMode = false, isSelected = false, onToggleSelect, view = 'grid' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (compareMode) {
      onToggleSelect?.(suit.id)
    } else {
      navigate(`/armory/${suit.id}`)
    }
  }

  /* ── List view ── */
  if (view === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        onClick={handleClick}
        className={clsx(
          'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors scan-hover',
          isSelected
            ? 'bg-[rgba(0,212,255,0.07)]'
            : 'hover:bg-bg-card',
        )}
        style={{ borderBottom: '1px solid rgba(0,212,255,0.07)' }}
      >
        {/* Primary color strip */}
        <div
          className="w-0.5 self-stretch rounded-full flex-shrink-0"
          style={{ background: suit.color_primary || '#C0392B', minHeight: 28 }}
        />

        {/* Suit thumbnail */}
        <div className="w-9 h-11 flex-shrink-0">
          <img
            src={suit.image_path}
            alt={suit.designation}
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="font-mono-ui text-xs text-[#00D4FF] tracking-wider truncate leading-tight">
            {suit.designation}
          </p>
          <p className="font-body text-[11px] text-text-secondary truncate leading-tight">
            "{suit.nickname}"
          </p>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <EraTag era={suit.era} />
          <ScopeBadge scope={suit.scope} />
          <StatusBadge status={suit.status} />
        </div>

        {/* Key stats */}
        <div className="hidden md:flex gap-5 flex-shrink-0">
          {[['DUR', suit.stats?.durability], ['SPD', suit.stats?.speed], ['FPR', suit.stats?.firepower]].map(
            ([lbl, val]) => (
              <div key={lbl} className="text-center w-7">
                <p className="font-mono-ui text-[8px] text-text-secondary tracking-widest">{lbl}</p>
                <p className="font-mono-ui text-xs text-text-primary">{val ?? '—'}</p>
              </div>
            )
          )}
        </div>

        {/* Compare checkbox */}
        {compareMode && (
          <div className={clsx(
            'flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all',
            isSelected
              ? 'bg-[#00D4FF] border-[#00D4FF]'
              : 'border-[rgba(0,212,255,0.3)]'
          )}
            style={{ border: isSelected ? 'none' : '1px solid rgba(0,212,255,0.3)' }}>
            {isSelected && <Check className="w-2.5 h-2.5 text-bg-base" />}
          </div>
        )}
      </motion.div>
    )
  }

  /* ── Grid view ── */
  return (
    <motion.div
      variants={cardVariants}
      onClick={handleClick}
      className={clsx(
        'relative flex flex-col bg-bg-card cursor-pointer transition-all duration-200 rounded overflow-hidden scan-hover group',
        compareMode
          ? isSelected
            ? 'ring-2 ring-[#00D4FF]'
            : 'hover:ring-1 hover:ring-[rgba(0,212,255,0.45)]'
          : '',
      )}
      style={{
        border: '1px solid rgba(0,212,255,0.12)',
        boxShadow: isSelected
          ? '0 0 20px rgba(0,212,255,0.25)'
          : compareMode
          ? 'none'
          : '0 0 8px rgba(0,212,255,0.04)',
      }}
      whileHover={!compareMode ? { y: -3, boxShadow: '0 0 24px rgba(0,212,255,0.2), inset 0 0 24px rgba(0,212,255,0.06)' } : {}}
    >
      {/* Color accent top strip */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-70"
        style={{
          background: `linear-gradient(90deg, ${suit.color_primary || '#C0392B'}, ${suit.color_secondary || '#FFB800'})`,
        }}
      />

      {/* Selected overlay checkmark */}
      {compareMode && isSelected && (
        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#00D4FF] flex items-center justify-center shadow-lg">
          <Check className="w-3 h-3 text-bg-base font-bold" />
        </div>
      )}

      {/* Badges */}
      <div className="flex items-center gap-1.5 px-3 pt-3 flex-wrap">
        <EraTag era={suit.era} />
        <ScopeBadge scope={suit.scope} />
        <div className="ml-auto"><StatusBadge status={suit.status} /></div>
      </div>

      {/* Suit image */}
      <div className="relative flex items-center justify-center h-40 px-4 mt-1 overflow-hidden">
        {/* Color ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at center, ${suit.color_primary || '#C0392B'}22 0%, transparent 70%)`,
          }}
        />
        <img
          src={suit.image_path}
          alt={suit.designation}
          className="relative z-10 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ filter: `drop-shadow(0 4px 16px ${suit.color_primary || '#C0392B'}55)` }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const fb = e.currentTarget.nextElementSibling
            if (fb) fb.style.display = 'flex'
          }}
        />
        {/* Fallback silhouette */}
        <div className="absolute inset-0 items-center justify-center z-10" style={{ display: 'none' }}>
          <div
            className="w-14 h-20 rounded-t-full opacity-25 transition-opacity group-hover:opacity-40"
            style={{
              background: `linear-gradient(180deg, ${suit.color_primary || '#C0392B'}, ${suit.color_secondary || '#FFB800'})`,
            }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-3 pb-3 flex-1">
        <div>
          <p className="font-mono-ui text-xs text-[#00D4FF] tracking-wider leading-tight">
            {suit.designation}
          </p>
          <p className="font-body text-xs text-text-secondary leading-tight truncate">
            "{suit.nickname}"
          </p>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-2 rounded-sm"
            style={{ background: suit.color_primary || '#C0392B' }}
            title={suit.color_primary}
          />
          <div
            className="w-3.5 h-2 rounded-sm opacity-80"
            style={{ background: suit.color_secondary || '#FFB800' }}
            title={suit.color_secondary}
          />
        </div>

        {/* Capability chips */}
        <div className="flex flex-wrap gap-1">
          {(suit.capabilities || []).slice(0, 3).map((cap) => (
            <CapChip key={cap} label={cap} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
