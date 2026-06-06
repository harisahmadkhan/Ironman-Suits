import { clsx } from 'clsx'

const STATUS_CONFIG = {
  active:          { label: 'ACTIVE',          dot: 'bg-status-active',     text: 'text-status-active' },
  destroyed:       { label: 'DESTROYED',       dot: 'bg-status-destroyed',  text: 'text-status-destroyed' },
  decommissioned:  { label: 'DECOMMISSIONED',  dot: 'bg-status-decom',      text: 'text-status-decom' },
}

export default function StatusBadge({ status, showLabel = true, className }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.decommissioned
  return (
    <span className={clsx('inline-flex items-center gap-1.5', className)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot,
        status === 'active' && 'shadow-[0_0_6px_currentColor] animate-arc-pulse'
      )} />
      {showLabel && (
        <span className={clsx('font-mono-ui text-[10px] tracking-widest uppercase', cfg.text)}>
          {cfg.label}
        </span>
      )}
    </span>
  )
}
