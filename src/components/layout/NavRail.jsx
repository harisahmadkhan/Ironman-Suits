import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutGrid, Clock, Layers, Terminal, Volume2, VolumeX, Zap } from 'lucide-react'
import clsx from 'clsx'
import useCompareStore from '@/store/compareStore'
import useSoundStore from '@/store/soundStore'

export default function NavRail({ onOpenTerminal }) {
  const [expanded, setExpanded] = useState(false)
  const [terminalPulsing, setTerminalPulsing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const location = useLocation()

  const { compareMode, toggleCompareMode } = useCompareStore()
  const { muted, toggleMute } = useSoundStore()

  // First-visit pulse: draw attention to terminal icon once per session
  useEffect(() => {
    const key = 'ia-terminal-pulsed'
    if (sessionStorage.getItem(key)) return
    const t = setTimeout(() => {
      setTerminalPulsing(true)
      sessionStorage.setItem(key, '1')
      setTimeout(() => setTerminalPulsing(false), 2400)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  const isTimelineActive = location.pathname === '/armory' && location.search.includes('view=timeline')

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 56 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col flex-shrink-0 h-screen bg-bg-panel z-40 overflow-hidden"
      style={{ borderRight: '1px solid rgba(0,212,255,0.15)' }}
    >
      {/* Logo / toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-3 px-4 py-[18px] w-full hover:bg-bg-card transition-colors"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}
      >
        <Zap className="w-5 h-5 flex-shrink-0 text-[#00D4FF]" />
        {expanded && (
          <span className="font-display text-[10px] text-text-primary tracking-[0.2em] whitespace-nowrap">
            STARK ARMORY
          </span>
        )}
      </button>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        <NavLink
          to="/armory"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded transition-colors',
              isActive && !isTimelineActive
                ? 'bg-bg-card text-[#00D4FF] border border-[#00D4FF]/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
            )
          }
        >
          <LayoutGrid className="w-4 h-4 flex-shrink-0" />
          {expanded && (
            <span className="font-mono-ui text-xs tracking-wider whitespace-nowrap">ARMORY</span>
          )}
        </NavLink>

        <NavLink
          to="/armory?view=timeline"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded transition-colors',
            isTimelineActive
              ? 'bg-bg-card text-[#00D4FF] border border-[#00D4FF]/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
          )}
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          {expanded && (
            <span className="font-mono-ui text-xs tracking-wider whitespace-nowrap">TIMELINE</span>
          )}
        </NavLink>

        {/* Compare mode toggle */}
        <button
          onClick={toggleCompareMode}
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded transition-all w-full text-left mt-1',
            compareMode
              ? 'bg-bg-card text-[#FFB800] border border-[#FFB800]/30'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
          )}
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          {expanded && (
            <span className="font-mono-ui text-xs tracking-wider whitespace-nowrap">
              {compareMode ? 'COMPARE ACTIVE' : 'COMPARE MODE'}
            </span>
          )}
          {compareMode && !expanded && (
            <span className="absolute left-9 top-[188px] w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
          )}
        </button>
      </nav>

      {/* Bottom section */}
      <div
        className="flex flex-col gap-1 p-2"
        style={{ borderTop: '1px solid rgba(0,212,255,0.15)' }}
      >
        {/* Terminal */}
        <div className="relative">
          <button
            onClick={onOpenTerminal}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded transition-colors w-full text-left',
              terminalPulsing
                ? 'text-[#00D4FF] bg-[rgba(0,212,255,0.08)] animate-pulse'
                : 'text-text-secondary hover:text-[#00D4FF] hover:bg-bg-card'
            )}
          >
            <Terminal className="w-4 h-4 flex-shrink-0" />
            {expanded && (
              <span className="font-mono-ui text-xs tracking-wider whitespace-nowrap">
                TERMINAL [/]
              </span>
            )}
          </button>

          {/* Tooltip (collapsed only) */}
          {!expanded && showTooltip && (
            <div
              className="absolute left-14 top-1/2 -translate-y-1/2 bg-bg-card font-mono-ui text-[#00D4FF] text-xs px-2.5 py-1 rounded whitespace-nowrap pointer-events-none z-50"
              style={{ border: '1px solid rgba(0,212,255,0.3)' }}
            >
              Terminal Access [/]
            </div>
          )}
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-card w-full"
        >
          {muted
            ? <VolumeX className="w-4 h-4 flex-shrink-0" />
            : <Volume2 className="w-4 h-4 flex-shrink-0" />
          }
          {expanded && (
            <span className="font-mono-ui text-xs tracking-wider whitespace-nowrap">
              SOUND [{muted ? 'OFF' : 'ON'}]
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
