import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const COLOR_MAP = {
  durability:      '#00D4FF',
  speed:           '#00FF88',
  firepower:       '#C0392B',
  maneuverability: '#FFB800',
  ai_systems:      '#A855F7',
  stealth:         '#374151',
}

export default function StatBar({ label, value, statKey, className }) {
  const color = COLOR_MAP[statKey] ?? '#00D4FF'

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono-ui text-xs text-text-secondary uppercase tracking-widest">
          {label ?? statKey?.replace('_', ' ')}
        </span>
        <span className="font-mono-ui text-xs text-text-mono">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-bg-panel rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
