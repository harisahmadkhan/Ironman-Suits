export default function BlueprintBackground({ markI = false }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ background: '#080D16' }}>
      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,${markI ? '0.04' : '0.055'}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,${markI ? '0.04' : '0.055'}) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          filter: markI ? 'blur(0.4px)' : 'none',
        }}
      />
      {/* Major grid dividers */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '250px 250px',
        }}
      />

      {/* Corner registration marks */}
      {[
        'top-5 left-5 border-l border-t',
        'top-5 right-5 border-r border-t',
        'bottom-5 left-5 border-l border-b',
        'bottom-5 right-5 border-r border-b',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${cls}`}
          style={{ borderColor: 'rgba(0,212,255,0.28)' }}
        />
      ))}

      {/* Dimension tick marks along edges */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`tick-h-${i}`}
          className="absolute"
          style={{
            left: `${12.5 * (i + 1)}%`,
            top: 20,
            width: 1,
            height: 5,
            background: 'rgba(0,212,255,0.2)',
          }}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`tick-v-${i}`}
          className="absolute"
          style={{
            top: `${16.6 * (i + 1)}%`,
            left: 20,
            height: 1,
            width: 5,
            background: 'rgba(0,212,255,0.2)',
          }}
        />
      ))}

      {/* Document label */}
      <p
        className="absolute bottom-3 right-6 font-mono-ui text-[7px] tracking-[0.25em] uppercase"
        style={{ color: 'rgba(0,212,255,0.18)' }}
      >
        STARK INDUSTRIES · CLASSIFIED SCHEMATIC · REV 8.5
      </p>
      <p
        className="absolute bottom-3 left-6 font-mono-ui text-[7px] tracking-[0.25em] uppercase"
        style={{ color: 'rgba(0,212,255,0.18)' }}
      >
        {markI ? 'PROTOTYPE — CAVE BUILD' : 'PRODUCTION VARIANT'}
      </p>

      {/* Mark I: subtle grain overlay */}
      {markI && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
          }}
        />
      )}
    </div>
  )
}
