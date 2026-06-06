import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function CommandPalette({ open, query, setQuery, results, parsed, execute, onClose }) {
  const inputRef = useRef(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelected(0)
    } else {
      setSelected(0)
    }
  }, [open])

  useEffect(() => { setSelected(0) }, [results.length])

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((i) => Math.min(i + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter') {
      if (results.length > 0 && selected >= 0) {
        execute(`/armory/${results[selected].id}`)
      } else {
        execute()
      }
    }
  }

  const isJarvis = parsed?.type === 'easter-egg' && parsed?.egg === 'jarvis'

  const HINTS = [
    ['[suit name / mark]',    '→ go to suit detail'],
    ['era: origin',           '→ filter by era'],
    ['capability: stealth',   '→ filter by capability'],
    ['scope: comics',         '→ filter by scope'],
    ['status: destroyed',     '→ filter by status'],
    ['compare [id] [id]',     '→ open comparison'],
    ['timeline',              '→ bookshelf view'],
    ['jarvis',                '→ ???'],
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cp-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
          style={{ background: 'rgba(5,7,10,0.9)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-2xl mx-4 bg-bg-panel rounded overflow-hidden"
            style={{
              border: '1px solid rgba(0,212,255,0.35)',
              boxShadow: '0 0 60px rgba(0,212,255,0.12), 0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}
            >
              <span className="font-mono-ui text-[#00D4FF] text-xs tracking-[0.2em]">
                STARK INDUSTRIES — TERMINAL ACCESS
              </span>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Input row */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
            >
              <span className="font-mono-ui text-[#00D4FF] text-sm select-none">{'>'}</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent font-mono-ui text-text-primary text-sm outline-none"
                placeholder="search suits, era: origin, compare mark-3 mark-85..."
                spellCheck={false}
                autoComplete="off"
              />
              <span className="blink-cursor font-mono-ui text-sm text-[#00D4FF] opacity-80" />
            </div>

            {/* JARVIS easter egg */}
            {isJarvis && (
              <div className="px-4 py-8 text-center space-y-3">
                <p className="font-mono-ui text-[#FFB800] text-sm tracking-[0.25em] animate-pulse">
                  GOOD MORNING, MR. STARK. HOW CAN I ASSIST?
                </p>
                <p className="font-mono-ui text-text-secondary text-xs tracking-wider">
                  JARVIS ONLINE — RE-SORTING BY AI SYSTEMS SCORE...
                </p>
                <button
                  onClick={() => execute()}
                  className="mt-2 font-mono-ui text-xs px-5 py-2 text-[#00D4FF] transition-colors hover:bg-bg-card"
                  style={{ border: '1px solid rgba(0,212,255,0.3)' }}
                >
                  ACTIVATE JARVIS
                </button>
              </div>
            )}

            {/* Live results */}
            {!isJarvis && results.length > 0 && (
              <ul className="max-h-64 overflow-y-auto">
                {results.map((suit, i) => (
                  <li key={suit.id}>
                    <button
                      onClick={() => execute(`/armory/${suit.id}`)}
                      className={clsx(
                        'flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left',
                        i === selected
                          ? 'bg-bg-card'
                          : 'hover:bg-bg-card'
                      )}
                    >
                      {/* Color swatch */}
                      <div
                        className="w-5 h-5 rounded-sm flex-shrink-0"
                        style={{
                          background: suit.color_primary || '#1a1a2e',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono-ui text-xs text-[#00D4FF] leading-tight">
                          {suit.designation}
                        </p>
                        <p className="font-mono-ui text-xs text-text-secondary leading-tight truncate">
                          {suit.nickname}
                        </p>
                      </div>
                      <span className="font-mono-ui text-[10px] text-text-secondary uppercase tracking-wider flex-shrink-0">
                        {suit.era}
                      </span>
                      {i === selected && (
                        <span className="font-mono-ui text-[10px] text-[#00D4FF] flex-shrink-0">[ENTER]</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Help hints (no query) */}
            {!isJarvis && !results.length && !query && (
              <div className="px-4 py-4">
                <p className="font-mono-ui text-text-secondary text-[10px] tracking-widest mb-3 uppercase">
                  Quick Commands
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                  {HINTS.map(([cmd, desc]) => (
                    <div key={cmd} className="flex gap-2 items-baseline min-w-0">
                      <span className="font-mono-ui text-[#00D4FF] text-xs flex-shrink-0">{cmd}</span>
                      <span className="font-mono-ui text-text-secondary text-xs truncate">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No results for a query */}
            {!isJarvis && query && results.length === 0 && parsed?.type === 'search' && (
              <div className="px-4 py-5 text-center">
                <p className="font-mono-ui text-text-secondary text-xs tracking-wider">
                  NO SUITS MATCHING <span className="text-[#00D4FF]">"{query}"</span>
                </p>
              </div>
            )}

            {/* Footer hints */}
            <div
              className="flex gap-5 px-4 py-2"
              style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}
            >
              {[['ESC', 'close'], ['↑↓', 'navigate'], ['ENTER', 'select']].map(([key, label]) => (
                <span key={key} className="font-mono-ui text-text-secondary text-[10px] tracking-wider">
                  [{key}] {label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
