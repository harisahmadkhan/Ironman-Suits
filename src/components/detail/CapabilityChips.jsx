import { motion } from 'framer-motion'
import { containerVariants, cardVariants } from '@/lib/motion'
import { panelVariants } from '@/lib/motion'

const FLAG_LABELS = {
  space_capable:     'Space-capable',
  stealth:           'Stealth',
  underwater:        'Underwater',
  ai_integrated:     'AI-integrated',
  nanotech:          'Nanotech',
  remote_controlled: 'Remote-controlled',
  vibranium_laced:   'Vibranium-laced',
}

export default function CapabilityChips({ capabilities = [], capabilityFlags = {} }) {
  return (
    <motion.div
      custom={1}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className="rounded p-4"
      style={{
        background: 'rgba(10,15,24,0.82)',
        border: '1px solid rgba(0,212,255,0.2)',
        boxShadow: '0 0 20px rgba(0,212,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-3">
        — CAPABILITIES —
      </p>

      {/* Primary capabilities */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-wrap gap-2 mb-3"
      >
        {capabilities.map((cap) => (
          <motion.span
            key={cap}
            variants={cardVariants}
            className="inline-flex items-center px-3 py-1 rounded font-mono-ui text-[10px] tracking-wider uppercase text-text-primary"
            style={{
              border: '1px solid rgba(0,212,255,0.3)',
              background: 'rgba(0,212,255,0.07)',
            }}
          >
            {cap}
          </motion.span>
        ))}
      </motion.div>

      {/* Capability flags (active ones only) */}
      {Object.entries(FLAG_LABELS).some(([key]) => capabilityFlags[key]) && (
        <>
          <p className="font-mono-ui text-[8px] text-text-secondary tracking-[0.2em] uppercase mb-2 mt-2">
            Special Flags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(FLAG_LABELS).map(([key, label]) =>
              capabilityFlags[key] ? (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono-ui text-[9px] tracking-wider"
                  style={{
                    border: '1px solid rgba(0,255,136,0.3)',
                    background: 'rgba(0,255,136,0.06)',
                    color: '#00FF88',
                  }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#00FF88] inline-block" />
                  {label}
                </span>
              ) : null
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
