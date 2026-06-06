import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react'
import { pageVariants } from '@/lib/motion'
import suits from '@/data/suits.json'
import useCompareStore from '@/store/compareStore'
import BlueprintBackground from '@/components/detail/BlueprintBackground'
import SuitHero          from '@/components/detail/SuitHero'
import SpecsTable         from '@/components/detail/SpecsTable'
import StatsRadar         from '@/components/detail/StatsRadar'
import CapabilityChips   from '@/components/detail/CapabilityChips'
import LegacyTrail       from '@/components/detail/LegacyTrail'

export default function SuitDetail() {
  const { suitId } = useParams()
  const navigate = useNavigate()
  const { compareMode, toggleCompareMode, toggleSuit, isSelected } = useCompareStore()

  const suitIndex = useMemo(() => suits.findIndex((s) => s.id === suitId), [suitId])
  const suit = suits[suitIndex]

  const prevSuit = suitIndex > 0 ? suits[suitIndex - 1] : null
  const nextSuit = suitIndex < suits.length - 1 ? suits[suitIndex + 1] : null

  const isMarkI = suit?.id === 'mark-1'
  const selected = suit ? isSelected(suit.id) : false

  if (!suit) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-mono-ui text-[#FF4444] text-sm tracking-widest">SUIT NOT FOUND</p>
          <Link to="/armory" className="font-mono-ui text-[10px] text-[#00D4FF] hover:underline tracking-wider">
            ← RETURN TO ARMORY
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 overflow-y-auto relative"
    >
      {/* Full-bleed blueprint background */}
      <BlueprintBackground markI={isMarkI} />

      {/* Content — above background */}
      <div className="relative z-10 px-6 py-5 max-w-6xl mx-auto pb-16">

        {/* ── Header nav ──────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/armory')}
            className="flex items-center gap-2 font-mono-ui text-[10px] text-text-secondary hover:text-[#00D4FF] transition-colors tracking-wider group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            ARMORY
          </button>

          <div className="flex items-center gap-2">
            {/* Compare mode toggle */}
            <button
              onClick={() => {
                if (!compareMode) toggleCompareMode()
                toggleSuit(suit.id)
              }}
              className="flex items-center gap-2 px-3 py-1.5 font-mono-ui text-[10px] tracking-wider transition-all"
              style={{
                border: `1px solid ${selected ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.2)'}`,
                background: selected ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: selected ? '#00D4FF' : 'rgba(122,143,166,0.9)',
              }}
            >
              <Layers className="w-3 h-3" />
              {selected ? 'SELECTED FOR COMPARE' : 'ADD TO COMPARE'}
            </button>
          </div>
        </div>

        {/* ── Main layout: hero + specs ────────────── */}
        <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
          {/* Left: suit hero with callout lines */}
          <SuitHero suit={suit} />

          {/* Right: specs + identification JARVIS panel */}
          <SpecsTable suit={suit} />
        </div>

        {/* ── Capabilities ─────────────────────────── */}
        <div className="mt-6">
          <CapabilityChips
            capabilities={suit.capabilities}
            capabilityFlags={suit.capability_flags}
          />
        </div>

        {/* ── Stats radar ──────────────────────────── */}
        <div className="mt-6">
          <StatsRadar stats={suit.stats} color={suit.color_primary} />
        </div>

        {/* ── Lore ────────────────────────────────── */}
        {suit.lore && (
          <motion.div
            custom={3}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 rounded p-4"
            style={{
              background: 'rgba(10,15,24,0.75)',
              border: '1px solid rgba(0,212,255,0.15)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-2">
              — LORE —
            </p>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              {suit.lore}
            </p>
          </motion.div>
        )}

        {/* ── Legacy trail (Mark I only) ───────────── */}
        {isMarkI && suit.legacy_trail?.length > 0 && (
          <div className="mt-4">
            <LegacyTrail trail={suit.legacy_trail} />
          </div>
        )}

        {/* ── Navigation: prev / next ──────────────── */}
        <div className="flex items-center justify-between mt-8 pt-4"
          style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          {prevSuit ? (
            <button
              onClick={() => navigate(`/armory/${prevSuit.id}`)}
              className="flex items-center gap-2 font-mono-ui text-[10px] text-text-secondary hover:text-text-primary transition-colors tracking-wider group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <p className="text-[8px] text-text-secondary/50 uppercase tracking-wider">Previous</p>
                <p>{prevSuit.designation}</p>
              </div>
            </button>
          ) : (
            <div />
          )}

          <p className="font-mono-ui text-[9px] text-text-secondary/40 tracking-wider">
            {suitIndex + 1} / {suits.length}
          </p>

          {nextSuit ? (
            <button
              onClick={() => navigate(`/armory/${nextSuit.id}`)}
              className="flex items-center gap-2 font-mono-ui text-[10px] text-text-secondary hover:text-text-primary transition-colors tracking-wider group text-right"
            >
              <div className="text-right">
                <p className="text-[8px] text-text-secondary/50 uppercase tracking-wider">Next</p>
                <p>{nextSuit.designation}</p>
              </div>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </motion.div>
  )
}
