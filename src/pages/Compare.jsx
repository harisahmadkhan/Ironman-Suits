import { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit3, ChevronRight } from 'lucide-react'
import { pageVariants } from '@/lib/motion'
import suits from '@/data/suits.json'
import useCompareStore from '@/store/compareStore'
import ComparePanel from '@/components/compare/ComparePanel'
import OverlaidRadar from '@/components/compare/OverlaidRadar'

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT_COLORS = ['#00D4FF', '#C0392B', '#FFB800', '#00FF88']

const SPEC_ROWS = [
  { isSection: true, label: 'GENERAL' },
  {
    key: 'power_source',
    label: 'POWER SOURCE',
    getText: s => s.power_source ?? '—',
    getNum: null,
  },
  {
    key: 'year_built',
    label: 'YEAR BUILT',
    getText: s => String(s.year_built_canonical ?? '—'),
    getNum: null,
  },
  {
    key: 'materials',
    label: 'MATERIALS',
    getText: s => `${s.materials?.length ?? 0} types`,
    getNum: s => s.materials?.length ?? 0,
    higher: true,
  },
  { isSection: true, label: 'PERFORMANCE' },
  {
    key: 'max_speed',
    label: 'MAX SPEED',
    getText: s => `Mach ${s.max_speed_mach ?? 0}`,
    getNum: s => s.max_speed_mach ?? 0,
    higher: true,
  },
  {
    key: 'altitude',
    label: 'MAX ALTITUDE',
    getText: s => `${(s.max_altitude_ft ?? 0).toLocaleString()} ft`,
    getNum: s => s.max_altitude_ft ?? 0,
    higher: true,
  },
  {
    key: 'weight',
    label: 'WEIGHT',
    getText: s => `${s.weight_kg ?? 0} kg`,
    getNum: s => s.weight_kg ?? 0,
    higher: false,
  },
  { isSection: true, label: 'STATISTICS' },
  {
    key: 'durability',
    label: 'DURABILITY',
    getText: s => s.stats?.durability ?? 0,
    getNum: s => s.stats?.durability ?? 0,
    higher: true,
    isStat: true,
  },
  {
    key: 'speed_stat',
    label: 'SPEED',
    getText: s => s.stats?.speed ?? 0,
    getNum: s => s.stats?.speed ?? 0,
    higher: true,
    isStat: true,
  },
  {
    key: 'firepower',
    label: 'FIREPOWER',
    getText: s => s.stats?.firepower ?? 0,
    getNum: s => s.stats?.firepower ?? 0,
    higher: true,
    isStat: true,
  },
  {
    key: 'maneuver',
    label: 'MANEUVER',
    getText: s => s.stats?.maneuverability ?? 0,
    getNum: s => s.stats?.maneuverability ?? 0,
    higher: true,
    isStat: true,
  },
  {
    key: 'ai_systems',
    label: 'A.I. SYSTEMS',
    getText: s => s.stats?.ai_systems ?? 0,
    getNum: s => s.stats?.ai_systems ?? 0,
    higher: true,
    isStat: true,
  },
  {
    key: 'stealth_stat',
    label: 'STEALTH',
    getText: s => s.stats?.stealth ?? 0,
    getNum: s => s.stats?.stealth ?? 0,
    higher: true,
    isStat: true,
  },
]

const FLAG_LABELS = {
  space_capable:     'Space-Capable',
  stealth:           'Stealth',
  underwater:        'Underwater',
  ai_integrated:     'AI-Integrated',
  nanotech:          'Nanotech',
  remote_controlled: 'Remote-Controlled',
  vibranium_laced:   'Vibranium-Laced',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeWinners(selectedSuits) {
  const winners = {}
  for (const row of SPEC_ROWS) {
    if (row.isSection || !row.getNum) continue
    const vals = selectedSuits.map(s => row.getNum(s))
    const target = row.higher ? Math.max(...vals) : Math.min(...vals)
    winners[row.key] = new Set(
      selectedSuits.filter((_, i) => vals[i] === target).map(s => s.id)
    )
  }
  return winners
}

function computeVerdict(selectedSuits, winners) {
  if (selectedSuits.length < 2) return ''
  const counts = Object.fromEntries(selectedSuits.map(s => [s.id, 0]))
  for (const winSet of Object.values(winners)) {
    if (winSet.size === 1) winSet.forEach(id => { if (id in counts) counts[id]++ })
  }
  const total = Object.keys(winners).length
  const ranked = [...selectedSuits].sort((a, b) => counts[b.id] - counts[a.id])
  const top = ranked[0]
  const topCount = counts[top.id]

  if (topCount === 0) {
    return `All ${selectedSuits.length} suits are evenly matched across ${total} categories.`
  }

  let text = `${top.designation} leads with ${topCount} of ${total} categories.`
  const STAT_KEYS = ['durability', 'speed_stat', 'firepower', 'maneuver', 'ai_systems', 'stealth_stat']
  const statWins = STAT_KEYS.filter(k => winners[k]?.has(top.id) && winners[k].size === 1).length

  if (statWins >= 4)                                                              text += ' Best all-rounder.'
  else if (winners.firepower?.has(top.id)   && winners.firepower.size === 1)     text += ' Superior firepower.'
  else if (winners.max_speed?.has(top.id)   && winners.max_speed.size === 1)     text += ' Fastest in class.'
  else if (winners.ai_systems?.has(top.id)  && winners.ai_systems.size === 1)    text += ' Most advanced A.I.'
  else if (winners.durability?.has(top.id)  && winners.durability.size === 1)    text += ' Highest durability.'
  else if (winners.stealth_stat?.has(top.id)&& winners.stealth_stat.size === 1)  text += ' Best stealth profile.'

  return text
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Compare() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { compareMode, toggleCompareMode, toggleSuit, clearSelection } = useCompareStore()

  const suitIds = useMemo(() => {
    const raw = searchParams.get('suits') ?? ''
    return raw.split(',').filter(Boolean)
  }, [searchParams])

  const selectedSuits = useMemo(
    () => suitIds.map(id => suits.find(s => s.id === id)).filter(Boolean),
    [suitIds]
  )

  // Sync URL suits back into compareStore (handles direct URL / page refresh)
  useEffect(() => {
    if (selectedSuits.length < 2) return
    clearSelection()
    if (!compareMode) toggleCompareMode()
    selectedSuits.forEach(s => toggleSuit(s.id))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const winners  = useMemo(() => computeWinners(selectedSuits),          [selectedSuits])
  const verdict  = useMemo(() => computeVerdict(selectedSuits, winners), [selectedSuits, winners])

  const allCaps = useMemo(
    () => [...new Set(selectedSuits.flatMap(s => s.capabilities ?? []))],
    [selectedSuits]
  )
  const activeFlags = useMemo(
    () => Object.keys(FLAG_LABELS).filter(k => selectedSuits.some(s => s.capability_flags?.[k])),
    [selectedSuits]
  )

  const N = selectedSuits.length
  const colTemplate = `180px repeat(${N}, 1fr)`

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (N < 2) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 overflow-y-auto flex items-center justify-center"
        style={{ background: '#080D16' }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
            style={{ border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.04)' }}
          >
            <span className="font-mono-ui text-[#00D4FF] text-xl leading-none">⊘</span>
          </div>
          <p className="font-display text-text-primary text-sm tracking-widest">
            NO SUITS SELECTED
          </p>
          <p className="font-mono-ui text-[10px] text-text-secondary tracking-wider">
            Select 2–4 suits from the Armory to begin comparative analysis
          </p>
          <button
            onClick={() => navigate('/armory')}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 font-mono-ui text-[10px] tracking-wider text-[#00D4FF] hover:opacity-70 transition-opacity"
            style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)' }}
          >
            GO TO ARMORY
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    )
  }

  // ── Full compare view ────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 overflow-y-auto relative"
      style={{ background: '#080D16' }}
    >
      <div className="relative z-10 px-6 py-5 max-w-7xl mx-auto pb-16">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.3em] uppercase mb-1 opacity-60">
              JARVIS // ANALYSIS MODE
            </p>
            <h1 className="font-display text-2xl font-bold text-text-primary tracking-wider">
              COMPARATIVE ANALYSIS
            </h1>
            <p className="font-mono-ui text-[10px] text-text-secondary mt-1">
              {N} suit{N > 1 ? 's' : ''} selected · {N === 4 ? 'Maximum capacity' : `Add ${4 - N} more`}
            </p>
          </div>
          <button
            onClick={() => navigate('/armory')}
            className="flex items-center gap-2 px-4 py-2 font-mono-ui text-[10px] tracking-wider text-text-secondary hover:text-[#00D4FF] transition-colors"
            style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.04)' }}
          >
            <Edit3 className="w-3 h-3" />
            EDIT SELECTION
          </button>
        </div>

        {/* ── Comparison table ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded overflow-hidden mb-6"
          style={{ border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(8,12,20,0.9)' }}
        >
          {/* Suit header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: colTemplate,
              borderBottom: '1px solid rgba(0,212,255,0.1)',
            }}
          >
            <div className="flex items-end pb-3 pt-3 px-4">
              <p className="font-mono-ui text-[8px] text-text-secondary tracking-widest uppercase opacity-30">
                SPEC
              </p>
            </div>
            {selectedSuits.map((suit, i) => (
              <ComparePanel
                key={suit.id}
                suit={suit}
                colorIndex={i}
                onRemove={
                  N > 2
                    ? () => navigate(`/compare?suits=${suitIds.filter(id => id !== suit.id).join(',')}`)
                    : null
                }
              />
            ))}
          </div>

          {/* Spec rows */}
          {SPEC_ROWS.map((row, ri) => {
            // Section divider
            if (row.isSection) {
              return (
                <div
                  key={`sec-${row.label}`}
                  className="grid"
                  style={{ gridTemplateColumns: colTemplate }}
                >
                  <div
                    className="col-span-full px-4 py-1.5"
                    style={{
                      background: 'rgba(0,212,255,0.04)',
                      borderTop: '1px solid rgba(0,212,255,0.08)',
                      borderBottom: '1px solid rgba(0,212,255,0.08)',
                    }}
                  >
                    <p className="font-mono-ui text-[8px] text-[#00D4FF] tracking-[0.3em] uppercase opacity-50">
                      {row.label}
                    </p>
                  </div>
                </div>
              )
            }

            const winSet = winners[row.key]

            return (
              <div
                key={row.key}
                className="grid"
                style={{
                  gridTemplateColumns: colTemplate,
                  borderBottom: ri < SPEC_ROWS.length - 1 ? '1px solid rgba(0,212,255,0.05)' : 'none',
                }}
              >
                {/* Row label */}
                <div className="flex items-center px-4 py-3">
                  <p className="font-mono-ui text-[9px] text-text-secondary tracking-wider uppercase opacity-60">
                    {row.label}
                  </p>
                </div>

                {/* Suit value cells */}
                {selectedSuits.map((suit) => {
                  const isWinner   = winSet?.has(suit.id)
                  const isClearWin = isWinner && winSet.size === 1
                  const val        = String(row.getText(suit))

                  return (
                    <div
                      key={suit.id}
                      className="flex items-center justify-center px-3 py-3"
                      style={{
                        borderLeft: '1px solid rgba(0,212,255,0.05)',
                        background: isClearWin ? 'rgba(0,212,255,0.04)' : 'transparent',
                      }}
                    >
                      <div className="text-center">
                        <p
                          className="font-mono-ui text-[11px] font-semibold tracking-wide leading-tight"
                          style={{
                            color: isClearWin
                              ? '#00D4FF'
                              : isWinner
                              ? 'rgba(0,212,255,0.55)'
                              : 'rgba(122,143,166,0.45)',
                            textShadow: isClearWin ? '0 0 10px rgba(0,212,255,0.35)' : 'none',
                          }}
                        >
                          {val}
                        </p>

                        {isClearWin && (
                          <span className="font-mono-ui text-[6px] text-[#00D4FF] tracking-widest opacity-50 block mt-0.5">
                            ▲ BEST
                          </span>
                        )}

                        {row.isStat && (
                          <div
                            className="mt-1.5 h-[2px] rounded-full overflow-hidden w-10 mx-auto"
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${val}%`,
                                background: isClearWin ? '#00D4FF' : 'rgba(122,143,166,0.25)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </motion.div>

        {/* ── Bottom: Radar + Capabilities grid ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Overlaid radar chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <OverlaidRadar suits={selectedSuits} />
          </motion.div>

          {/* Capabilities grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="rounded p-4"
            style={{
              background: 'rgba(10,15,24,0.82)',
              border: '1px solid rgba(0,212,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-4">
              — CAPABILITIES —
            </p>

            {/* Column headers: suit abbreviations */}
            <div
              className="grid mb-2 pb-2"
              style={{
                gridTemplateColumns: `1fr repeat(${N}, 36px)`,
                borderBottom: '1px solid rgba(0,212,255,0.08)',
              }}
            >
              <div />
              {selectedSuits.map((suit, i) => (
                <div key={suit.id} className="text-center">
                  <p
                    className="font-mono-ui text-[7px] tracking-wider uppercase leading-tight"
                    style={{ color: ACCENT_COLORS[i] }}
                  >
                    {suit.designation.replace('MARK ', 'MK')}
                  </p>
                </div>
              ))}
            </div>

            {/* Capability rows — scrollable */}
            <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: 256 }}>
              {allCaps.map(cap => (
                <div
                  key={cap}
                  className="grid items-center py-1"
                  style={{
                    gridTemplateColumns: `1fr repeat(${N}, 36px)`,
                    borderBottom: '1px solid rgba(0,212,255,0.03)',
                  }}
                >
                  <p className="font-mono-ui text-[8px] text-text-secondary uppercase tracking-wider truncate pr-2">
                    {cap}
                  </p>
                  {selectedSuits.map(suit => (
                    <div key={suit.id} className="flex items-center justify-center">
                      {suit.capabilities?.includes(cap) ? (
                        <span className="text-[#00FF88] text-[12px] leading-none">✓</span>
                      ) : (
                        <span className="font-mono-ui text-[9px] text-text-secondary opacity-15">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Special flags section */}
              {activeFlags.length > 0 && (
                <>
                  <div className="pt-3 pb-1">
                    <p className="font-mono-ui text-[7px] text-[#FFB800] tracking-[0.3em] uppercase opacity-55">
                      SPECIAL FLAGS
                    </p>
                  </div>
                  {activeFlags.map(flagKey => (
                    <div
                      key={flagKey}
                      className="grid items-center py-1"
                      style={{ gridTemplateColumns: `1fr repeat(${N}, 36px)` }}
                    >
                      <p className="font-mono-ui text-[8px] text-[#FFB800] uppercase tracking-wider truncate pr-2 opacity-65">
                        {FLAG_LABELS[flagKey]}
                      </p>
                      {selectedSuits.map(suit => (
                        <div key={suit.id} className="flex items-center justify-center">
                          {suit.capability_flags?.[flagKey] ? (
                            <span className="text-[#FFB800] text-[11px] leading-none">★</span>
                          ) : (
                            <span className="font-mono-ui text-[9px] text-text-secondary opacity-15">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── HEAD-TO-HEAD VERDICT ─────────────────────────────────────────── */}
        {verdict && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="rounded p-5 mb-6"
            style={{
              background: 'rgba(255,184,0,0.03)',
              border: '1px solid rgba(255,184,0,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1" style={{ background: 'rgba(255,184,0,0.2)' }} />
              <p className="font-mono-ui text-[9px] text-[#FFB800] tracking-[0.3em] uppercase whitespace-nowrap">
                HEAD-TO-HEAD VERDICT
              </p>
              <div className="h-px flex-1" style={{ background: 'rgba(255,184,0,0.2)' }} />
            </div>
            <p className="font-mono-ui text-sm text-text-primary tracking-wide text-center">
              {verdict}
            </p>
          </motion.div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/armory')}
            className="flex items-center gap-2 px-6 py-2.5 font-mono-ui text-[10px] tracking-wider text-text-secondary hover:text-[#00D4FF] transition-colors"
            style={{ border: '1px solid rgba(0,212,255,0.12)' }}
          >
            <Edit3 className="w-3 h-3" />
            EDIT SELECTION — RETURN TO ARMORY
          </button>
        </div>
      </div>
    </motion.div>
  )
}
