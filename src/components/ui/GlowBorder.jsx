import { clsx } from 'clsx'

/**
 * A wrapper div with the glow border treatment.
 * Pass `intense` for a stronger glow (hover state).
 */
export default function GlowBorder({ children, className, intense = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={clsx(
        'border rounded-sm transition-all duration-300',
        intense
          ? 'border-border-glow/50 shadow-glow-lg'
          : 'border-border-glow/20 shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
