import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import suits from '@/data/suits.json'

const LINE1 = 'STARK INDUSTRIES — SUIT ARCHIVE'
const TAGLINE_WORDS = ['GENIUS.', 'BILLIONAIRE.', 'PLAYBOY.', 'PHILANTHROPIST.', 'FUTURIST.']
const SUIT_COUNT = suits.length

const STATUS_LINES = [
  { label: 'POWER SYSTEMS',      value: 'ONLINE',              ok: true  },
  { label: 'ARC REACTOR',        value: '3.00 GJ/s',           ok: true  },
  { label: 'REPULSOR DRIVE',     value: 'CALIBRATED',          ok: true  },
  { label: 'AI CORE',            value: 'LOADING...',          ok: false },
  { label: 'SUIT DATABASE',      value: `${SUIT_COUNT} SUITS`, ok: true  },
  { label: 'NEURAL INTERFACE',   value: 'LINKED',              ok: true  },
  { label: 'THREAT ASSESSMENT',  value: 'CLEAR',               ok: true  },
  { label: 'AI CORE',            value: 'READY',               ok: true  },
]

// Stable particle positions (deterministic, no Math.random on render)
const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 11) * 2.23) % 100,
  y: ((i * 53 + 7) * 1.87) % 100,
  size: (i % 3) + 1,
  delay: (i * 0.21) % 5,
  dur: 3 + (i % 5),
}))

function ArcReactor({ pulse, size = 'sm' }) {
  const dim = size === 'lg' ? 'w-56 h-56' : 'w-20 h-20'
  // 6 trapezoidal coil blades — faithful to the Mark I prop
  const blades = [0,60,120,180,240,300].map((deg) => {
    const rad = (deg * Math.PI) / 180
    const half = 24 * Math.PI / 180
    const r1 = 33, r2 = 62
    const x1 = 100 + Math.cos(rad - half) * r1
    const y1 = 100 + Math.sin(rad - half) * r1
    const x2 = 100 + Math.cos(rad + half) * r1
    const y2 = 100 + Math.sin(rad + half) * r1
    const x3 = 100 + Math.cos(rad + half) * r2
    const y3 = 100 + Math.sin(rad + half) * r2
    const x4 = 100 + Math.cos(rad - half) * r2
    const y4 = 100 + Math.sin(rad - half) * r2
    return `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`
  })

  return (
    <svg viewBox="0 0 200 200" className={dim} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer housing disc */}
      <circle cx="100" cy="100" r="97" fill="#080c14" stroke="#1c2c42" strokeWidth="2.5" />
      {/* Outer rim glow */}
      <circle cx="100" cy="100" r="90" stroke="#3a7aaa" strokeWidth="3.5" strokeOpacity="0.7" />
      <circle cx="100" cy="100" r="87" stroke="#55aadd" strokeWidth="1" strokeOpacity="0.35" />

      {/* 6 coil blade sections */}
      {blades.map((pts, i) => (
        <polygon key={i} points={pts}
          fill="#1a3a5c" stroke="#4499cc" strokeWidth="1.2"
          fillOpacity="0.85" strokeOpacity="0.9" />
      ))}

      {/* Thin separator lines between blades */}
      {[0,60,120,180,240,300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const sx = 100 + Math.cos(rad + 24 * Math.PI/180) * 33
        const sy = 100 + Math.sin(rad + 24 * Math.PI/180) * 33
        const ex = 100 + Math.cos(rad + 24 * Math.PI/180) * 62
        const ey = 100 + Math.sin(rad + 24 * Math.PI/180) * 62
        return <line key={deg} x1={sx} y1={sy} x2={ex} y2={ey} stroke="#080c14" strokeWidth="2.5" />
      })}

      {/* Inner ring housing */}
      <circle cx="100" cy="100" r="32" fill="#060a10" stroke="#3388bb" strokeWidth="2.5" strokeOpacity="0.9" />
      <circle cx="100" cy="100" r="28" stroke="#66bbee" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Blue core glow — layered */}
      <circle cx="100" cy="100" r="25" fill="#0044aa" fillOpacity="0.6" />
      <circle cx="100" cy="100" r="19" fill="#0066cc" fillOpacity="0.75" />
      <circle cx="100" cy="100" r="13" fill="#44aaff" fillOpacity="0.85" />
      <circle cx="100" cy="100" r="7"  fill="#aaddff" fillOpacity="0.95" />
      <circle cx="100" cy="100" r="3"  fill="white"   fillOpacity="1" />

      {/* Ambient outer glow ring */}
      <circle cx="100" cy="100" r="90" stroke="#55ccff" strokeWidth="8" strokeOpacity="0.06" />

      {pulse && (
        <>
          <circle cx="100" cy="100" r="19" fill="#33aaff" fillOpacity="0">
            <animate attributeName="r" values="19;55;19" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="100" r="90" stroke="#55aaff" strokeWidth="4" strokeOpacity="0">
            <animate attributeName="stroke-opacity" values="0;0.45;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  // boot phases: 0=black 1=reactor 2=status-stream 3=jarvis-online 4=hero
  const [bootPhase, setBootPhase] = useState(0)
  const [line1, setLine1]         = useState('')
  const [statusIdx, setStatusIdx] = useState(-1)   // which status line is visible
  const [jarvisOnline, setJarvisOnline] = useState(false)
  const [taglineIdx, setTaglineIdx] = useState(-1)
  const [showTip, setShowTip] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let cancelled = false
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

    const typeText = (text, setState, charDelay = 38) =>
      new Promise((resolve) => {
        let idx = 0
        const tick = () => {
          if (cancelled) { resolve(); return }
          idx++
          setState(text.slice(0, idx))
          if (idx < text.length) setTimeout(tick, charDelay)
          else resolve()
        }
        setTimeout(tick, charDelay)
      })

    const boot = async () => {
      await sleep(250)
      if (cancelled) return
      setBootPhase(1)                        // arc reactor

      await sleep(1400)
      if (cancelled) return
      setBootPhase(2)                        // type header line
      await typeText(LINE1, setLine1, 32)
      if (cancelled) return

      await sleep(200)
                                             // rapid status stream
      for (let i = 0; i < STATUS_LINES.length; i++) {
        if (cancelled) return
        setStatusIdx(i)
        await sleep(i === 3 ? 320 : 140)    // slight pause on "AI CORE LOADING"
      }

      await sleep(400)
      if (cancelled) return
      setBootPhase(3)                        // JARVIS ONLINE flash
      setJarvisOnline(true)

      await sleep(1000)
      if (cancelled) return
      setBootPhase(4)                        // hero

      await sleep(2200)
      if (cancelled) return
      setShowTip(true)
      await sleep(5000)
      if (cancelled) return
      setShowTip(false)
    }

    boot()
    return () => { cancelled = true }
  }, [])

  // Stagger tagline words after hero is visible
  useEffect(() => {
    if (bootPhase < 4) return
    let i = 0
    const iv = setInterval(() => {
      setTaglineIdx(i++)
      if (i >= TAGLINE_WORDS.length) clearInterval(iv)
    }, 380)
    return () => clearInterval(iv)
  }, [bootPhase])

  const handleMouseMove = (e) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    setMouse({
      x: ((e.clientX - cx) / cx) * 14,
      y: ((e.clientY - cy) / cy) * 7,
    })
  }

  return (
    <div
      className="relative flex-1 min-h-screen overflow-y-auto grid-overlay"
      style={{ background: 'var(--bg-base)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: '#00D4FF',
            }}
            animate={{ opacity: [0.06, 0.22, 0.06], y: [0, -12, 0] }}
            transition={{
              repeat: Infinity,
              duration: p.dur,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Boot overlay (phases 0–3): covers the full viewport including nav rail */}
      <AnimatePresence>
        {bootPhase < 4 && (
          <motion.div
            key="boot-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: 'rgba(8,10,14,0.97)' }}
          >
            {/* Arc reactor */}
            <AnimatePresence>
              {bootPhase >= 1 && (
                <motion.div
                  key="reactor"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-10"
                >
                  <ArcReactor pulse={bootPhase >= 1} size="lg" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boot text */}
            <div className="font-mono-ui text-center px-6 w-full max-w-md">
              {/* Header line */}
              {line1 && (
                <p className="text-[10px] text-[#00D4FF] tracking-[0.25em] mb-4 opacity-60">
                  {line1}{bootPhase === 2 && <span className="blink-cursor ml-0.5" />}
                </p>
              )}

              {/* Status stream */}
              {bootPhase >= 2 && !jarvisOnline && (
                <div className="space-y-[3px] text-left">
                  {STATUS_LINES.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={statusIdx >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                      transition={{ duration: 0.12 }}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-[10px] text-[#7A8FA6] tracking-widest">{s.label}</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: s.ok ? '#00FF88' : '#FFB800' }}
                        />
                        <span
                          className="text-[10px] tracking-wider"
                          style={{ color: s.ok ? '#00FF88' : '#FFB800' }}
                        >
                          {s.value}
                        </span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* J.A.R.V.I.S. ONLINE flash */}
              <AnimatePresence>
                {jarvisOnline && bootPhase === 3 && (
                  <motion.div
                    key="jarvis"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="mt-2"
                  >
                    <p
                      className="font-display text-2xl tracking-[0.35em] text-[#00FF88]"
                      style={{ textShadow: '0 0 24px rgba(0,255,136,0.8), 0 0 48px rgba(0,255,136,0.4)' }}
                    >
                      J.A.R.V.I.S. ONLINE
                    </p>
                    <p className="text-[9px] text-[#00FF88] opacity-60 tracking-[0.2em] mt-1">
                      {SUIT_COUNT} SUITS CATALOGUED
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <AnimatePresence>
        {bootPhase >= 4 && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center h-full min-h-screen"
            style={{ paddingTop: '2rem', paddingBottom: '4rem' }}
          >
            {/* Arc reactor hero — parallax */}
            <motion.div
              animate={{ x: mouse.x, y: mouse.y }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              className="relative mb-8 flex items-center justify-center"
            >
              {/* Ambient glow behind reactor */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 280, height: 280,
                  background: 'radial-gradient(ellipse at center, rgba(0,150,255,0.22) 0%, transparent 65%)',
                  filter: 'blur(32px)',
                }}
              />
              <div className="relative z-10 float">
                <ArcReactor pulse size="lg" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.8rem,8vw,6rem)] text-text-primary tracking-[0.28em] uppercase mb-3"
            >
              THE ARMORY
            </motion.h1>

            {/* Tagline — word by word */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-10 min-h-8">
              {TAGLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={taglineIdx >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-display text-[0.65rem] text-text-secondary tracking-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={() => navigate('/armory')}
              className="group glow-border-hover scan-hover flex items-center gap-2 px-8 py-3 font-mono-ui text-xs text-[#00D4FF] tracking-[0.22em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(0,212,255,0.35)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ACCESS ARMORY
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            {/* Stats line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-7 font-mono-ui text-[10px] text-text-secondary tracking-[0.2em] uppercase"
            >
              {SUIT_COUNT} SUITS CATALOGUED &nbsp;·&nbsp; MCU + COMICS &nbsp;·&nbsp; ALL ERAS
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal tip — fades in/out */}
      <AnimatePresence>
        {showTip && (
          <motion.p
            key="tip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed bottom-7 left-1/2 -translate-x-1/2 font-mono-ui text-[10px] text-text-secondary tracking-[0.2em] uppercase z-20 pointer-events-none"
          >
            Press / for terminal access
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
