import { clsx } from 'clsx'

const ERA_CONFIG = {
  origin:      { label: 'ORIGIN',      color: 'text-[#00D4FF] border-[#00D4FF]/30 bg-[#00D4FF]/10' },
  development: { label: 'DEVELOPMENT', color: 'text-[#00FF88] border-[#00FF88]/30 bg-[#00FF88]/10' },
  legion:      { label: 'LEGION',      color: 'text-[#FFB800] border-[#FFB800]/30 bg-[#FFB800]/10' },
  avengers:    { label: 'AVENGERS',    color: 'text-[#C0392B] border-[#C0392B]/30 bg-[#C0392B]/10' },
  endgame:     { label: 'ENDGAME',     color: 'text-[#A855F7] border-[#A855F7]/30 bg-[#A855F7]/10' },
  variants:    { label: 'VARIANTS',    color: 'text-[#7A8FA6] border-[#7A8FA6]/30 bg-[#7A8FA6]/10' },
  comics:      { label: 'COMICS',      color: 'text-[#F97316] border-[#F97316]/30 bg-[#F97316]/10' },
}

export default function EraTag({ era, className }) {
  const cfg = ERA_CONFIG[era] ?? ERA_CONFIG.variants
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
