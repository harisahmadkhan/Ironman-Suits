import { motion } from 'framer-motion'
import clsx from 'clsx'

// Blueprint callout line paths (as SVG path d strings, for pathLength animation)
// Coordinate space: 280×380 viewBox, image centered at ~(140,185)
const CALLOUTS = [
  {
    id: 'arc',
    path: 'M 148 145 L 240 90 L 275 90',
    label: 'ARC REACTOR',
    labelX: 278,
    labelY: 87,
    delay: 0.3,
  },
  {
    id: 'repulsor',
    path: 'M 90 205 L 20 165 L -10 165',
    label: 'REPULSOR',
    labelX: -12,
    labelY: 162,
    anchor: 'end',
    delay: 0.5,
  },
  {
    id: 'propulsion',
    path: 'M 148 320 L 148 355 L 240 355',
    label: null, // handled separately
    delay: 0.7,
  },
]

export default function SuitHero({ suit }) {
  const isMarkI = suit.id === 'mark-1'

  return (
    <div className="relative flex items-start justify-center pt-4">
      {/* Outer container — defines coordinate space for SVG */}
      <div className="relative" style={{ width: 280, height: 380 }}>
        {/* Ambient glow behind image */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '-20px',
            background: `radial-gradient(ellipse at 50% 55%, ${suit.color_primary || '#C0392B'}20 0%, transparent 65%)`,
            filter: 'blur(24px)',
          }}
        />

        {/* Suit image */}
        <img
          src={suit.image_path}
          alt={suit.designation}
          className={clsx('absolute inset-0 w-full h-full object-contain z-10', 'float')}
          style={{
            filter: isMarkI
              ? `drop-shadow(0 0 14px rgba(92,92,92,0.3)) contrast(0.87) brightness(0.8) sepia(0.25)`
              : `drop-shadow(0 0 28px ${suit.color_primary || '#C0392B'}60)`,
            padding: '24px 36px',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const fb = e.currentTarget.nextElementSibling
            if (fb) fb.style.display = 'flex'
          }}
        />

        {/* Fallback silhouette */}
        <div
          className="absolute inset-0 z-10 items-center justify-center float"
          style={{ display: 'none', padding: '32px 56px' }}
        >
          <div
            className="w-full h-full rounded-t-full"
            style={{
              background: `linear-gradient(180deg, ${suit.color_primary || '#C0392B'} 0%, ${suit.color_secondary || '#FFB800'} 100%)`,
              opacity: isMarkI ? 0.18 : 0.25,
              filter: isMarkI ? 'grayscale(0.7)' : 'none',
            }}
          />
        </div>

        {/* Blueprint callout lines SVG — overflow visible to extend beyond container */}
        <svg
          viewBox="0 0 280 380"
          className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-visible"
          style={{ opacity: isMarkI ? 0.4 : 0.55 }}
        >
          {/* Arc reactor callout */}
          <motion.path
            d="M 148 145 L 235 88 L 272 88"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="0.7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="148" cy="145" r="2.5"
            fill="#00D4FF"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.4 }}
          />
          <motion.text
            x="276" y="85"
            fill="#00D4FF"
            fontSize="6.5"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isMarkI ? 'PROTOTYPE REACTOR' : 'ARC REACTOR'}
          </motion.text>

          {/* Repulsor callout */}
          <motion.path
            d="M 88 210 L 22 168 L -8 168"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="0.7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="88" cy="210" r="2.5"
            fill="#00D4FF"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.55 }}
          />
          <motion.text
            x="-10" y="165"
            fill="#00D4FF"
            fontSize="6.5"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="1.5"
            textAnchor="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            REPULSOR ARRAY
          </motion.text>

          {/* Boot / propulsion callout */}
          <motion.path
            d="M 148 322 L 148 358 L 232 358"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="0.7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="148" cy="322" r="2.5"
            fill="#00D4FF"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.7 }}
          />
          <motion.text
            x="236" y="355"
            fill="#00D4FF"
            fontSize="6.5"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {isMarkI ? 'PROPULSION' : 'FLIGHT STABILIZERS'}
          </motion.text>
        </svg>
      </div>
    </div>
  )
}
