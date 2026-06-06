const ACCENT_COLORS = ['#00D4FF', '#C0392B', '#FFB800', '#00FF88']

export default function ComparePanel({ suit, colorIndex = 0, onRemove }) {
  const accent = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length]

  return (
    <div
      className="flex flex-col items-center text-center p-4"
      style={{ borderLeft: '1px solid rgba(0,212,255,0.06)' }}
    >
      {/* Accent gradient top bar */}
      <div
        className="w-full h-px mb-4"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      {/* Suit image */}
      <div className="relative w-28 h-36 mb-3">
        <div
          className="absolute inset-0 rounded"
          style={{
            background: `linear-gradient(135deg, ${suit.color_primary}22, ${suit.color_secondary ?? suit.color_primary}44)`,
            border: `1px solid ${suit.color_primary}33`,
          }}
        />
        <img
          src={suit.image_path}
          alt={suit.designation}
          className="absolute inset-0 w-full h-full object-contain z-10"
          style={{ padding: '8px' }}
          onError={e => { e.target.style.opacity = '0' }}
        />
      </div>

      {/* Designation */}
      <p className="font-display text-sm font-bold tracking-widest" style={{ color: accent }}>
        {suit.designation}
      </p>

      {/* Nickname */}
      <p className="font-mono-ui text-[9px] text-text-secondary mt-0.5 tracking-wider">
        {suit.nickname}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-1 mt-2 flex-wrap justify-center">
        <span
          className="font-mono-ui text-[7px] px-1.5 py-0.5 rounded-sm capitalize"
          style={{ border: '1px solid rgba(0,212,255,0.2)', color: 'rgba(0,212,255,0.6)' }}
        >
          {suit.scope}
        </span>
        <span
          className="font-mono-ui text-[7px] px-1.5 py-0.5 rounded-sm capitalize"
          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(122,143,166,0.6)' }}
        >
          {suit.status}
        </span>
      </div>

      {/* Remove (only when >2 suits so comparison stays valid) */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-3 font-mono-ui text-[7px] tracking-widest text-text-secondary hover:text-[#FF4444] transition-colors"
        >
          × REMOVE
        </button>
      )}
    </div>
  )
}
