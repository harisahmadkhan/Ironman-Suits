import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { pageVariants, containerVariants, cardVariants } from '@/lib/motion'
import { useFilteredSuits } from '@/hooks/useFilteredSuits'
import { suits as allSuits } from '@/hooks/useFilteredSuits'
import useCompareStore from '@/store/compareStore'
import FilterPanel from '@/components/catalogue/FilterPanel'
import ViewToggle from '@/components/catalogue/ViewToggle'
import SuitCard from '@/components/catalogue/SuitCard'
import TimelineView from '@/components/catalogue/TimelineView'

const DEFAULT_FILTERS = { era: [], scope: [], status: [], capabilities: [], search: '' }

// Build initial filters from URL search params (from command palette navigation)
function filtersFromParams(params) {
  const f = { ...DEFAULT_FILTERS }
  if (params.get('era'))         f.era         = [params.get('era')]
  if (params.get('scope'))       f.scope       = [params.get('scope')]
  if (params.get('status'))      f.status      = [params.get('status')]
  if (params.get('capability'))  f.capabilities = [params.get('capability')]
  return f
}

// Compare bottom bar
function CompareBar({ selectedIds, onRemove, onOpen }) {
  const selected = useMemo(
    () => selectedIds.map((id) => allSuits.find((s) => s.id === id)).filter(Boolean),
    [selectedIds]
  )
  if (!selected.length) return null

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-0 right-0 z-30 flex items-center gap-4 px-6 py-3"
      style={{
        left: 56,
        background: 'rgba(10,12,16,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0,212,255,0.25)',
        boxShadow: '0 -8px 32px rgba(0,212,255,0.08)',
      }}
    >
      <p className="font-mono-ui text-[10px] text-[#00D4FF] tracking-widest flex-shrink-0">
        COMPARE MODE
      </p>

      {/* Selected suit pills */}
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {selected.map((suit) => (
          <div
            key={suit.id}
            className="flex items-center gap-2 px-2.5 py-1 rounded"
            style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.06)' }}
          >
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: suit.color_primary || '#C0392B' }}
            />
            <span className="font-mono-ui text-[10px] text-text-primary tracking-wider">
              {suit.designation}
            </span>
            <button
              onClick={() => onRemove(suit.id)}
              className="text-text-secondary hover:text-[#FF4444] transition-colors ml-0.5"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 2 - selected.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-2 px-2.5 py-1 rounded"
            style={{ border: '1px dashed rgba(0,212,255,0.15)' }}
          >
            <span className="font-mono-ui text-[10px] text-text-secondary/40 tracking-wider">
              + SELECT SUIT
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onOpen}
        disabled={selected.length < 2}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 font-mono-ui text-xs tracking-wider transition-all flex-shrink-0',
          selected.length >= 2
            ? 'text-[#00D4FF] hover:bg-[rgba(0,212,255,0.1)]'
            : 'text-text-secondary/40 cursor-not-allowed'
        )}
        style={{ border: `1px solid ${selected.length >= 2 ? 'rgba(0,212,255,0.35)' : 'rgba(0,212,255,0.1)'}` }}
      >
        OPEN COMPARISON
        <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

export default function Armory() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { compareMode, selectedSuits, toggleSuit, removeSuit } = useCompareStore()

  // View: grid | list | timeline — synced with ?view= param
  const [view, setView] = useState(() =>
    searchParams.get('view') === 'list' ? 'list' : searchParams.get('view') === 'timeline' ? 'timeline' : 'grid'
  )

  // Filters: initialized from URL params (command palette navigation)
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams))

  // Re-init filters when URL changes (command palette re-navigation)
  useEffect(() => {
    const fromUrl = filtersFromParams(searchParams)
    const hasUrlFilter =
      searchParams.get('era') || searchParams.get('scope') ||
      searchParams.get('status') || searchParams.get('capability')
    if (hasUrlFilter) setFilters(fromUrl)

    const v = searchParams.get('view')
    if (v === 'list' || v === 'timeline') setView(v)
    else if (!v) setView('grid')
  }, [searchParams])

  const filteredSuits = useFilteredSuits(filters)
  const jarvisMode    = searchParams.get('jarvis') === '1'

  // In JARVIS mode: re-sort by AI Systems descending
  const displaySuits = jarvisMode
    ? [...filteredSuits].sort((a, b) => (b.stats?.ai_systems ?? 0) - (a.stats?.ai_systems ?? 0))
    : filteredSuits

  const handleViewChange = (v) => {
    setView(v)
    // keep other params intact
  }

  const handleOpenComparison = () => {
    navigate(`/compare?suits=${selectedSuits.join(',')}`)
  }

  const isSelected = (id) => selectedSuits.includes(id)

  // Stable key for AnimatePresence — changes when display order changes
  const gridKey = displaySuits.map((s) => s.id).join(',')

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col flex-1 overflow-hidden"
    >
      {/* ── Top bar ─────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-5 py-3 bg-bg-panel flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.12)' }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 max-w-xs px-3 py-1.5 rounded"
          style={{ border: '1px solid rgba(0,212,255,0.18)', background: 'rgba(0,212,255,0.03)' }}
        >
          <Search className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search suits…"
            className="flex-1 bg-transparent font-mono-ui text-xs text-text-primary placeholder-text-secondary/40 outline-none min-w-0"
            spellCheck={false}
          />
          {filters.search && (
            <button onClick={() => setFilters((f) => ({ ...f, search: '' }))}>
              <X className="w-3 h-3 text-text-secondary hover:text-text-primary" />
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="font-mono-ui text-[10px] text-text-secondary tracking-wider whitespace-nowrap">
          <span className="text-text-primary">{displaySuits.length}</span>
          <span className="opacity-50"> / {allSuits.length} SUITS</span>
        </p>

        {/* JARVIS mode indicator */}
        {jarvisMode && (
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded font-mono-ui text-[10px] text-[#FFB800] tracking-wider animate-pulse"
            style={{ border: '1px solid rgba(255,184,0,0.35)', background: 'rgba(255,184,0,0.06)' }}
          >
            ★ JARVIS MODE — SORTED BY A.I. SYSTEMS
          </div>
        )}

        {/* Compare mode indicator */}
        {compareMode && (
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded font-mono-ui text-[10px] text-[#FFB800] tracking-wider"
            style={{ border: '1px solid rgba(255,184,0,0.3)', background: 'rgba(255,184,0,0.06)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
            COMPARE MODE ACTIVE
          </div>
        )}

        <div className="ml-auto">
          <ViewToggle view={view} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter sidebar */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={allSuits.length}
          filteredCount={filteredSuits.length}
        />

        {/* Grid / list / timeline area */}
        <div className="flex-1 overflow-y-auto">
          {view === 'timeline' ? (
            <TimelineView
              suits={displaySuits}
              compareMode={compareMode}
              selectedIds={selectedSuits}
              onToggleSelect={toggleSuit}
            />
          ) : view === 'list' ? (
            <motion.div
              key={gridKey}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="divide-y-0 pb-24"
            >
              <AnimatePresence mode="popLayout">
                {displaySuits.map((suit) => (
                  <SuitCard
                    key={suit.id}
                    suit={suit}
                    view="list"
                    compareMode={compareMode}
                    isSelected={isSelected(suit.id)}
                    onToggleSelect={toggleSuit}
                  />
                ))}
              </AnimatePresence>

              {displaySuits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <p className="font-mono-ui text-text-secondary text-xs tracking-wider">NO SUITS MATCH CURRENT FILTERS</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="font-mono-ui text-[10px] text-[#00D4FF] hover:underline tracking-wider"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Grid view */
            <div className="p-5 pb-24">
              <motion.div
                key={gridKey}
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
              >
                <AnimatePresence mode="popLayout">
                  {displaySuits.map((suit) => (
                    <SuitCard
                      key={suit.id}
                      suit={suit}
                      view="grid"
                      compareMode={compareMode}
                      isSelected={isSelected(suit.id)}
                      onToggleSelect={toggleSuit}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {displaySuits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <p className="font-mono-ui text-text-secondary text-xs tracking-wider">NO SUITS MATCH CURRENT FILTERS</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="font-mono-ui text-[10px] text-[#00D4FF] hover:underline tracking-wider"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Compare bottom bar ──────────────────────────── */}
      <AnimatePresence>
        {compareMode && selectedSuits.length > 0 && (
          <CompareBar
            selectedIds={selectedSuits}
            onRemove={removeSuit}
            onOpen={handleOpenComparison}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
