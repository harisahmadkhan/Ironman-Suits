import { clsx } from 'clsx'

const SCOPE_CONFIG = {
  mcu:    { label: 'MCU',    color: 'text-[#00D4FF] border-[#00D4FF]/40 bg-[#00D4FF]/10' },
  comics: { label: 'COMICS', color: 'text-[#F97316] border-[#F97316]/40 bg-[#F97316]/10' },
  both:   { label: 'BOTH',   color: 'text-[#00FF88] border-[#00FF88]/40 bg-[#00FF88]/10' },
}

export default function ScopeBadge({ scope, className }) {
  const cfg = SCOPE_CONFIG[scope] ?? SCOPE_CONFIG.mcu
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-sm border font-mono-ui text-[10px] tracking-widest uppercase',
        cfg.color,
        className
      )}
    >
      {cfg.label}
    </span>
  )
}
