import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { suits } from '@/hooks/useFilteredSuits'

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Global `/` key listener
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openPalette  = useCallback(() => setOpen(true), [])
  const closePalette = useCallback(() => { setOpen(false); setQuery('') }, [])

  // Parse natural language query into a typed command
  const parsed = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { type: 'empty' }

    if (q === 'jarvis')     return { type: 'easter-egg', egg: 'jarvis' }
    if (q === 'timeline')   return { type: 'navigate', path: '/armory?view=timeline' }

    const eraPrefixes   = ['era:', 'era ']
    const scopePrefixes = ['scope:', 'scope ']
    const capPrefixes   = ['capability:', 'cap:', 'capability ']
    const statusPrefixes = ['status:', 'status ']
    const comparePrefixes = ['compare ']

    for (const p of eraPrefixes)    if (q.startsWith(p)) return { type: 'filter', filterType: 'era',   value: q.slice(p.length).trim() }
    for (const p of scopePrefixes)  if (q.startsWith(p)) return { type: 'filter', filterType: 'scope', value: q.slice(p.length).trim() }
    for (const p of capPrefixes)    if (q.startsWith(p)) return { type: 'filter', filterType: 'capability', value: q.slice(p.length).trim() }
    for (const p of statusPrefixes) if (q.startsWith(p)) return { type: 'filter', filterType: 'status', value: q.slice(p.length).trim() }
    for (const p of comparePrefixes) {
      if (q.startsWith(p)) {
        const rest = q.slice(p.length).trim().split(/\s+/)
        return { type: 'compare', slugs: rest }
      }
    }

    return { type: 'search', value: q }
  }, [query])

  // Live search results (suit matches)
  const results = useMemo(() => {
    if (!query.trim() || parsed.type === 'easter-egg') return []
    const q = query.toLowerCase()
    return suits
      .filter((s) =>
        s.designation.toLowerCase().includes(q) ||
        s.nickname.toLowerCase().includes(q) ||
        s.id.includes(q.replace(/\s/g, '-'))
      )
      .slice(0, 8)
  }, [query, parsed])

  // Execute the current parsed command
  const execute = useCallback((overridePath) => {
    if (overridePath) {
      navigate(overridePath)
      closePalette()
      return
    }
    const { type, path, filterType, value, slugs, egg } = parsed
    if (type === 'navigate')                        { navigate(path); closePalette() }
    if (type === 'filter')                          { navigate(`/armory?${filterType}=${encodeURIComponent(value)}`); closePalette() }
    if (type === 'easter-egg' && egg === 'jarvis')  { navigate('/armory?jarvis=1'); closePalette() }
    if (type === 'compare')   {
      const ids = slugs.map((s) => suits.find((suit) => suit.id.includes(s) || suit.designation.toLowerCase().includes(s))?.id).filter(Boolean)
      if (ids.length) { navigate(`/compare?suits=${ids.join(',')}`); closePalette() }
    }
  }, [parsed, navigate, closePalette])

  return { open, query, setQuery, results, parsed, openPalette, closePalette, execute }
}

export default useCommandPalette
