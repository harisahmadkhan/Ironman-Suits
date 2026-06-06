import { LayoutGrid, List, Clock } from 'lucide-react'
import clsx from 'clsx'

const VIEWS = [
  { id: 'grid',     Icon: LayoutGrid, label: 'Grid' },
  { id: 'list',     Icon: List,        label: 'List' },
  { id: 'timeline', Icon: Clock,       label: 'Timeline' },
]

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div
      className="flex items-center rounded overflow-hidden"
      style={{ border: '1px solid rgba(0,212,255,0.2)' }}
    >
      {VIEWS.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          title={label}
          className={clsx(
            'flex items-center justify-center w-8 h-7 transition-colors',
            view === id
              ? 'bg-[rgba(0,212,255,0.15)] text-[#00D4FF]'
              : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(0,212,255,0.05)]'
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  )
}
