import { motion } from 'framer-motion'
import { panelVariants } from '@/lib/motion'
import EraTag from '@/components/ui/EraTag'
import ScopeBadge from '@/components/ui/ScopeBadge'
import StatusBadge from '@/components/ui/StatusBadge'

function Row({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex gap-4 py-1" style={{ borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
      <span className="font-mono-ui text-[10px] text-text-secondary tracking-wider w-28 flex-shrink-0 uppercase">
        {label}
      </span>
      <span className="font-mono-ui text-[11px] text-text-primary leading-tight flex-1">
        {value}
      </span>
    </div>
  )
}

export default function SpecsTable({ suit }) {
  const films = suit.films?.join(', ') || '—'
  const comics = suit.comics_appearances?.join(', ') || null
  const materials = suit.materials?.join(', ') || '—'
  const speedStr = suit.max_speed_mach ? `Mach ${suit.max_speed_mach}` : '—'
  const altStr = suit.max_altitude_ft ? `${suit.max_altitude_ft.toLocaleString()} ft` : '—'
  const weightStr = suit.weight_kg ? `${suit.weight_kg} kg` : '—'

  return (
    <motion.div
      custom={0}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className="rounded overflow-hidden"
      style={{
        background: 'rgba(10,15,24,0.82)',
        border: '1px solid rgba(0,212,255,0.2)',
        boxShadow: '0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.03)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.12)' }}
      >
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="font-display text-xl text-text-primary tracking-[0.12em]">
            {suit.designation}
          </h1>
          {suit.year_built_canonical && (
            <span className="font-mono-ui text-[10px] text-text-secondary">
              {suit.year_built_canonical}
            </span>
          )}
        </div>
        <p className="font-body text-text-secondary text-sm mb-3">
          "{suit.nickname}"
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <EraTag era={suit.era} />
          <ScopeBadge scope={suit.scope} />
          <StatusBadge status={suit.status} />
        </div>
      </div>

      {/* Metadata rows */}
      <div className="px-4 py-2">
        <p
          className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-2 mt-1"
        >
          — IDENTIFICATION —
        </p>
        <Row label="First Appearance" value={suit.first_appearance} />
        {suit.films?.length > 0 && <Row label="MCU Films" value={films} />}
        {comics && <Row label="Comics" value={comics} />}
      </div>

      <div className="px-4 pb-2">
        <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-2 mt-3">
          — SPECIFICATIONS —
        </p>
        <Row label="Power Source" value={suit.power_source} />
        <Row label="Materials" value={materials} />
        <Row label="Max Speed" value={speedStr} />
        <Row label="Max Altitude" value={altStr} />
        <Row label="Weight" value={weightStr} />
      </div>
    </motion.div>
  )
}
