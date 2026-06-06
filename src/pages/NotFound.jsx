import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

// Flickering arc reactor SVG
function ArcReactorError() {
  const [flicker, setFlicker] = useState(1)

  useEffect(() => {
    let t
    const schedule = () => {
      const delay = 600 + Math.random() * 2000
      t = setTimeout(() => {
        setFlicker(Math.random() > 0.3 ? 0.15 : 1)
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      style={{ opacity: flicker, transition: 'opacity 0.06s' }}
    >
      {/* Outer ring */}
      <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(255,68,68,0.3)" strokeWidth="1" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,68,68,0.2)" strokeWidth="0.5" />

      {/* Spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="70" y1="70"
          x2={70 + 50 * Math.cos((angle * Math.PI) / 180)}
          y2={70 + 50 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(255,68,68,0.2)"
          strokeWidth="0.5"
        />
      ))}

      {/* Inner triangle (damaged) */}
      <polygon
        points="70,42 94,84 46,84"
        fill="none"
        stroke="rgba(255,68,68,0.5)"
        strokeWidth="1.5"
        strokeDasharray="8 4"
      />

      {/* Core */}
      <circle cx="70" cy="70" r="18" fill="rgba(255,68,68,0.06)" stroke="rgba(255,68,68,0.4)" strokeWidth="1" />
      <circle cx="70" cy="70" r="8" fill="rgba(255,68,68,0.12)" stroke="rgba(255,68,68,0.6)" strokeWidth="1" />

      {/* Pulse ring — slow heartbeat */}
      <motion.circle
        cx="70" cy="70" r="26"
        fill="none"
        stroke="rgba(255,68,68,0.4)"
        strokeWidth="1"
        initial={{ r: 26, opacity: 0.5 }}
        animate={{ r: 52, opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* ERROR cross */}
      <line x1="58" y1="58" x2="82" y2="82" stroke="rgba(255,68,68,0.7)" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="58" x2="58" y2="82" stroke="rgba(255,68,68,0.7)" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  )
}

// Scan lines ticker
const SCAN_LINES = [
  'SCANNING SUIT DATABASE...',
  'QUERYING 81 REGISTERED UNITS...',
  'NO MATCH FOUND',
  'CROSS-REFERENCING SERIAL NO.',
  'ARCHIVE SEARCH: NULL',
  'SUIT REGISTRY: RECORD MISSING',
  'JARVIS: DESIGNATION UNKNOWN',
]

function ScanTicker() {
  const [line, setLine] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setLine(l => (l + 1) % SCAN_LINES.length)
        setVisible(true)
      }, 120)
    }, 900)
    return () => clearInterval(iv)
  }, [])

  return (
    <p
      className="font-mono-ui text-[10px] tracking-widest text-[#FF4444] transition-opacity duration-100"
      style={{ opacity: visible ? 0.6 : 0, minHeight: '16px' }}
    >
      {SCAN_LINES[line]}
    </p>
  )
}

export default function NotFound() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 overflow-y-auto flex items-center justify-center"
      style={{ background: '#080D16' }}
    >
      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,68,68,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,68,68,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 text-center space-y-6 px-6">
        {/* Arc reactor */}
        <div className="flex justify-center mb-2">
          <ArcReactorError />
        </div>

        {/* Error code */}
        <div>
          <motion.p
            className="font-display text-7xl font-bold"
            style={{ color: 'rgba(255,68,68,0.15)', letterSpacing: '0.15em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            404
          </motion.p>
        </div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="font-display text-xl font-bold text-text-primary tracking-wider mb-1">
            SUIT NOT FOUND
          </p>
          <p className="font-mono-ui text-[11px] text-text-secondary tracking-widest">
            — INITIATING SEARCH PROTOCOL —
          </p>
        </motion.div>

        {/* Scan ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-6 flex items-center justify-center"
        >
          <ScanTicker />
        </motion.div>

        {/* Diagnostic panel */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mx-auto max-w-xs rounded p-4 text-left space-y-1.5"
          style={{
            background: 'rgba(255,68,68,0.04)',
            border: '1px solid rgba(255,68,68,0.2)',
          }}
        >
          {[
            ['STATUS', 'SUIT RECORD MISSING'],
            ['DATABASE', '81 SUITS INDEXED'],
            ['ERROR',   '0x404 — NOT FOUND'],
            ['ACTION',  'RETURN TO ARMORY'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-mono-ui text-[8px] text-[#FF4444] tracking-widest opacity-50 w-16 flex-shrink-0">
                {label}
              </span>
              <span className="font-mono-ui text-[10px] text-text-secondary tracking-wider">
                {value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Link
            to="/armory"
            className="inline-flex items-center gap-2 px-6 py-2.5 font-mono-ui text-[11px] tracking-wider text-[#00D4FF] hover:opacity-70 transition-opacity"
            style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.04)' }}
          >
            ← RETURN TO ARMORY
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
