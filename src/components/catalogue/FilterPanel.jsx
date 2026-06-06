import { useState } from 'react'
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

const ERA_OPTIONS = [
  { value: 'origin',      label: 'Origin',       sub: 'Mark I–III' },
  { value: 'development', label: 'Development',  sub: 'Mark IV–VII' },
  { value: 'legion',      label: 'Legion',        sub: 'Mark VIII–XLII' },
  { value: 'avengers',    label: 'Avengers',      sub: 'Mark XLIII–L' },
  { value: 'endgame',     label: 'Endgame',       sub: 'Mark LI–LXXXV' },
  { value: 'variants',    label: 'Variants',      sub: 'War Machine, Rescue…' },
  { value: 'comics',      label: 'Comics Excl.',  sub: 'Comics only' },
]

const SCOPE_OPTIONS = [
  { value: 'mcu',    label: 'MCU' },
  { value: 'comics', label: 'Comics' },
  { value: 'both',   label: 'Both' },
]

const STATUS_OPTIONS = [
  { value: 'active',         label: 'Active' },
  { value: 'destroyed',      label: 'Destroyed' },
  { value: 'decommissioned', label: 'Decommissioned' },
]

const CAP_OPTIONS = [
  { value: 'space_capable',     label: 'Space-capable' },
  { value: 'stealth',           label: 'Stealth' },
  { value: 'underwater',        label: 'Underwater' },
  { value: 'ai_integrated',     label: 'AI-integrated' },
  { value: 'nanotech',          label: 'Nanotech' },
  { value: 'remote_controlled', label: 'Remote-controlled' },
  { value: 'vibranium_laced',   label: 'Vibranium-laced' },
]

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="py-1" style={{ borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-1.5 text-left"
      >
        <span className="font-mono-ui text-[9px] tracking-[0.22em] text-text-secondary uppercase">
          {title}
        </span>
        {open
          ? <ChevronUp className="w-2.5 h-2.5 text-text-secondary" />
          : <ChevronDown className="w-2.5 h-2.5 text-text-secondary" />
        }
      </button>
      {open && <div className="space-y-0.5 pb-1">{children}</div>}
    </div>
  )
}

function CheckRow({ label, sub, checked, onChange }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer group py-[3px] select-none">
      {/* Custom checkbox */}
      <div
        className={clsx(
          'mt-[1px] w-3 h-3 flex-shrink-0 rounded-sm transition-all flex items-center justify-center',
          checked
            ? 'bg-[#00D4FF]'
            : 'border border-[rgba(0,212,255,0.22)] group-hover:border-[rgba(0,212,255,0.5)]'
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-[1px]">
            <path d="M2 6.5L4.5 9L10 3" stroke="#0A0C10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'font-mono-ui text-[10px] leading-tight transition-colors',
          checked ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
        )}>
          {label}
        </p>
        {sub && (
          <p className="font-mono-ui text-[8px] leading-tight" style={{ color: 'rgba(122,143,166,0.5)' }}>
            {sub}
          </p>
        )}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} readOnly />
    </label>
  )
}

export default function FilterPanel({ filters, onFiltersChange, totalCount, filteredCount }) {
  const toggle = (key, value) => {
    const arr = filters[key] || []
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value]
    onFiltersChange({ ...filters, [key]: next })
  }

  const hasActive =
    filters.era.length || filters.scope.length ||
    filters.status.length || filters.capabilities.length

  const reset = () =>
    onFiltersChange({ era: [], scope: [], status: [], capabilities: [], search: filters.search })

  return (
    <aside
      className="flex flex-col w-48 flex-shrink-0 overflow-y-auto"
      style={{ borderRight: '1px solid rgba(0,212,255,0.1)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-bg-panel"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div>
          <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.22em] uppercase">Filters</p>
          <p className="font-mono-ui text-[9px] text-text-secondary mt-0.5">
            {filteredCount}<span className="opacity-50"> / {totalCount}</span>
          </p>
        </div>
        {hasActive ? (
          <button
            onClick={reset}
            className="flex items-center gap-1 font-mono-ui text-[8px] text-text-secondary hover:text-[#00D4FF] transition-colors tracking-wider"
          >
            <RotateCcw className="w-2 h-2" />
            RESET
          </button>
        ) : null}
      </div>

      <div className="px-4 py-1 flex-1">
        <Section title="ERA">
          {ERA_OPTIONS.map(({ value, label, sub }) => (
            <CheckRow
              key={value}
              label={label}
              sub={sub}
              checked={filters.era.includes(value)}
              onChange={() => toggle('era', value)}
            />
          ))}
        </Section>

        <Section title="SCOPE">
          {SCOPE_OPTIONS.map(({ value, label }) => (
            <CheckRow
              key={value}
              label={label}
              checked={filters.scope.includes(value)}
              onChange={() => toggle('scope', value)}
            />
          ))}
        </Section>

        <Section title="STATUS">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <CheckRow
              key={value}
              label={label}
              checked={filters.status.includes(value)}
              onChange={() => toggle('status', value)}
            />
          ))}
        </Section>

        <Section title="CAPABILITIES" defaultOpen={false}>
          {CAP_OPTIONS.map(({ value, label }) => (
            <CheckRow
              key={value}
              label={label}
              checked={filters.capabilities.includes(value)}
              onChange={() => toggle('capabilities', value)}
            />
          ))}
        </Section>
      </div>
    </aside>
  )
}
