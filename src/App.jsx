import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { useKonamiCode }     from '@/hooks/useKonamiCode'
import NavRail         from '@/components/layout/NavRail'
import CommandPalette  from '@/components/layout/CommandPalette'
import Landing         from '@/pages/Landing'
import Armory          from '@/pages/Armory'
import SuitDetail      from '@/pages/SuitDetail'
import Compare         from '@/pages/Compare'
import NotFound        from '@/pages/NotFound'

// ─── House Party Protocol overlay ────────────────────────────────────────────

function HousePartyOverlay({ onDismiss }) {
  return (
    <motion.div
      key="hpp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer"
      style={{ background: 'rgba(5,7,10,0.96)' }}
      onClick={onDismiss}
    >
      {/* Expanding rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: '1px solid rgba(255,184,0,0.4)' }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 600 + i * 200, height: 600 + i * 200, opacity: 0 }}
          transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Suit silhouette grid (35 dots for Legion era) */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#FFB800]"
            style={{
              left: `${((i * 41 + 7) % 100)}%`,
              bottom: '-10px',
            }}
            animate={{ y: -window.innerHeight - 20, opacity: [0.8, 0.8, 0] }}
            transition={{
              duration: 1.8 + (i % 5) * 0.3,
              delay: (i * 0.06) % 1.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Central content */}
      <div className="relative z-10 text-center space-y-4 px-6">
        <motion.p
          className="font-mono-ui text-[10px] tracking-[0.4em] text-[#FFB800] opacity-70 uppercase"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          STARK INDUSTRIES — PROTOCOL 40-A
        </motion.p>

        <motion.p
          className="font-display text-4xl font-bold text-[#FFB800] tracking-widest"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          style={{ textShadow: '0 0 40px rgba(255,184,0,0.5)' }}
        >
          HOUSE PARTY PROTOCOL
        </motion.p>

        <motion.p
          className="font-mono-ui text-sm text-[#FFB800] tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1] }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          INITIATING...
        </motion.p>

        <motion.p
          className="font-mono-ui text-[10px] text-text-secondary tracking-widest mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          35 UNITS DEPLOYED — CLICK TO DISMISS
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const location = useLocation()
  const palette  = useCommandPalette()
  const [houseParty, setHouseParty] = useState(false)

  const activateHouseParty = useCallback(() => {
    setHouseParty(true)
    setTimeout(() => setHouseParty(false), 5000)
  }, [])

  useKonamiCode(activateHouseParty)

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <NavRail onOpenTerminal={palette.openPalette} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<Landing />} />
            <Route path="/armory"         element={<Armory />} />
            <Route path="/armory/:suitId" element={<SuitDetail />} />
            <Route path="/compare"        element={<Compare />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <CommandPalette
        open={palette.open}
        query={palette.query}
        setQuery={palette.setQuery}
        results={palette.results}
        parsed={palette.parsed}
        execute={palette.execute}
        onClose={palette.closePalette}
      />

      {/* House Party Protocol overlay */}
      <AnimatePresence>
        {houseParty && (
          <HousePartyOverlay onDismiss={() => setHouseParty(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
