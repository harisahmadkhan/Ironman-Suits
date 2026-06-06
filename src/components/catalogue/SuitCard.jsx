import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import EraTag from '@/components/ui/EraTag'
import ScopeBadge from '@/components/ui/ScopeBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { cardVariants } from '@/lib/motion'

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
        'relative cursor-pointer rounded overflow-hidden group',
        compareMode
          ? isSelected
            ? 'ring-2 ring-[#00D4FF]'
            : 'hover:ring-1 hover:ring-[rgba(0,212,255,0.45)]'
          : '',
      )}
      style={{
        aspectRatio: '3/4',
        border: '1px solid rgba(0,212,255,0.12)',
        background: '#0A0C10',
        boxShadow: isSelected ? '0 0 20px rgba(0,212,255,0.25)' : 'none',
      }}
      whileHover={{ y: -4 }}
    >
      {/* Color accent top strip */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] z-10 opacity-70"
        style={{
          background: `linear-gradient(90deg, ${suit.color_primary || '#C0392B'}, ${suit.color_secondary || '#FFB800'})`,
        }}
      />

      {/* Compare checkmark */}
      {compareMode && isSelected && (
        <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-[#00D4FF] flex items-center justify-center shadow-lg">
          <Check className="w-3 h-3 text-bg-base" />
        </div>
      )}

      {/* Suit image fills the card */}
      <img
        src={suit.image_path}
        alt={suit.designation}
        className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-108 p-4"
        style={{ filter: `drop-shadow(0 4px 20px ${suit.color_primary || '#C0392B'}66)` }}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fb = e.currentTarget.nextElementSibling
          if (fb) fb.style.display = 'flex'
        }}
      />

      {/* Fallback: color gradient silhouette */}
      <div
        className="absolute inset-0 items-center justify-center"
        style={{ display: 'none' }}
      >
        <div
          className="w-1/2 h-3/4 rounded-t-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"
          style={{
            background: `linear-gradient(180deg, ${suit.color_primary || '#C0392B'}, ${suit.color_secondary || '#FFB800'})`,
          }}
        />
      </div>

      {/* Hover overlay: gradient + name */}
      <div
        className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${suit.color_primary || '#C0392B'}CC 0%, ${suit.color_primary || '#C0392B'}55 40%, transparent 70%)`,
        }}
      >
        <div className="px-3 pb-4">
          <p className="font-mono-ui text-[11px] text-white tracking-[0.18em] uppercase font-semibold leading-tight drop-shadow-lg">
            {suit.designation}
          </p>
          <p className="font-body text-[11px] text-white/70 leading-tight mt-0.5">
            "{suit.nickname}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}
