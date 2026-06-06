import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import suits from '@/data/suits.json'

const LINE1 = 'STARK INDUSTRIES — SUIT ARCHIVE v8.5'
const TAGLINE_WORDS = ['GENIUS.', 'BILLIONAIRE.', 'PLAYBOY.', 'PHILANTHROPIST.', 'FUTURIST.']
const SUIT_COUNT = suits.length

// Stable particle positions (deterministic, no Math.random on render)
const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 11) * 2.23) % 100,
  y: ((i * 53 + 7) * 1.87) % 100,
  size: (i % 3) + 1,
  delay: (i * 0.21) % 5,
  dur: 3 + (i % 5),
}))

function ArcReactor({ pulse }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-20 h-20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rings */}
      <circle cx="50" cy="50" r="46" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="38" stroke="#00D4FF" strokeWidth="0.5" strokeOpacity="0.25" />
      <circle cx="50" cy="50" r="30" stroke="#00D4FF" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Triangle (arc reactor geometry) */}
      <polygon
        points="50,22 72,64 28,64"
        stroke="#00D4FF"
        strokeWidth="1"
        strokeOpacity="0.7"
        fill="rgba(0,212,255,0.04)"
      />

      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 50 + Math.cos(rad) * 16
        const y1 = 50 + Math.sin(rad) * 16
        const x2 = 50 + Math.cos(rad) * 28
        const y2 = 50 + Math.sin(rad) * 28
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#00D4FF" strokeWidth="0.7" strokeOpacity="0.5" />
        )
      })}

      {/* Center glow */}
      <circle cx="50" cy="50" r="9" fill="#00D4FF" fillOpacity="0.15" />
      <circle cx="50" cy="50" r="6" fill="#00D4FF" fillOpacity="0.6" />
      <circle cx="50" cy="50" r="3" fill="white" fillOpacity="0.95" />

      {/* Animated pulse ring */}
      {pulse && (
        <>
          <circle cx="50" cy="50" r="9" fill="#00D4FF" fillOpacity="0">
            <animate attributeName="r" values="9;22;9" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="38" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0">
            <animate attributeName="stroke-opacity" values="0;0.4;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  // boot phases: 0=black 1=arc reactor 2=typing-line1 3=typing-line2 4=hero
  const [bootPhase, setBootPhase] = useState(0)
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [taglineIdx, setTaglineIdx] = useState(-1)
  const [showTip, setShowTip] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  // Master boot sequence — sequential async
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
      setBootPhase(1)              // arc reactor appears

      await sleep(1600)
      if (cancelled) return
      setBootPhase(2)              // start typing line 1

      await typeText(LINE1, setLine1)
      if (cancelled) return

      await sleep(280)
      setBootPhase(3)              // start typing line 2

      await typeText(
        `JARVIS ONLINE. [${SUIT_COUNT}] SUITS CATALOGUED.`,
        setLine2,
        36
      )
      if (cancelled) return

      await sleep(380)
      setBootPhase(4)              // reveal hero

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
                  <ArcReactor pulse={bootPhase >= 1} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boot text lines */}
            <div className="font-mono-ui text-sm text-center space-y-2 min-h-[3rem] px-6">
              {line1 && (
                <p className="text-[#00D4FF] tracking-widest">
                  {line1}
                  {bootPhase === 2 && <span className="blink-cursor ml-0.5" />}
                </p>
              )}
              {line2 && (
                <p className="text-text-secondary tracking-wider">
                  {line2}
                  <span className="blink-cursor ml-0.5" />
                </p>
              )}
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
            {/* Suit silhouette with parallax */}
            <motion.div
              animate={{ x: mouse.x, y: mouse.y }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              className="relative mb-8 w-52 h-72"
            >
              {/* Ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.18) 0%, transparent 65%)',
                  filter: 'blur(24px)',
                  transform: 'scale(1.4)',
                }}
              />
              {/* Suit image (floats, hides gracefully if 404) */}
              <img
                src="/suits/mark-85.png"
                alt="Iron Man Mark LXXXV"
                className="relative z-10 w-full h-full object-contain float"
                style={{ filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.35))' }}
                onError={(e) => {
                  // Fallback: show arc reactor shape placeholder
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback silhouette */}
              <div
                className="absolute inset-0 z-10 items-center justify-center float hidden"
                style={{ display: 'none' }}
              >
                <div
                  className="w-32 h-44 rounded-t-full opacity-20"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,212,255,0.4) 0%, rgba(192,57,43,0.4) 100%)',
                    border: '1px solid rgba(0,212,255,0.3)',
                  }}
                />
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
