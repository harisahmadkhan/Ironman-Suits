import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'

export default function LegacyTrail({ trail = [] }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!trail.length) return null

  return (
    <div
      className="rounded overflow-hidden"
      style={{
        border: '1px solid rgba(255,184,0,0.2)',
        background: 'rgba(10,12,16,0.7)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-3 text-left"
        style={{ borderBottom: open ? '1px solid rgba(255,184,0,0.15)' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[#FFB800]">
            WHAT THIS BUILT
          </span>
          <span
            className="font-mono-ui text-[8px] px-2 py-0.5 rounded-sm"
            style={{ border: '1px solid rgba(255,184,0,0.25)', color: 'rgba(255,184,0,0.6)' }}
          >
            MARK I LEGACY
          </span>
        </div>
        {open
          ? <ChevronUp className="w-3 h-3 text-[#FFB800] opacity-60" />
          : <ChevronDown className="w-3 h-3 text-[#FFB800] opacity-60" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              {trail.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                >
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#FFB800', opacity: 0.7 }}
                    />
                    {i < trail.length - 1 && (
                      <div
                        className="w-px flex-1 mt-1"
                        style={{ background: 'rgba(255,184,0,0.2)', minHeight: 16 }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-1">
                    <p className="font-mono-ui text-[10px] text-text-secondary leading-tight">
                      {entry.label}
                    </p>
                    <button
                      onClick={() => navigate(`/armory/${entry.led_to}`)}
                      className="flex items-center gap-1.5 mt-1 font-mono-ui text-[10px] text-[#FFB800] hover:text-[#FFD45C] transition-colors"
                    >
                      <ArrowRight className="w-2.5 h-2.5" />
                      {entry.note}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
