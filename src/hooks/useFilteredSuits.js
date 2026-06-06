import { useMemo } from 'react'
import suits from '@/data/suits.json'

const DEFAULT_FILTERS = {
  era: [],          // ['origin','development','legion','avengers','endgame','variants','comics']
  scope: [],        // ['mcu','comics','both']
  status: [],       // ['active','destroyed','decommissioned']
  capabilities: [], // ['space_capable','stealth','underwater','ai_integrated','nanotech','remote_controlled','vibranium_laced']
  search: '',
}

export function useFilteredSuits(filters = DEFAULT_FILTERS) {
  return useMemo(() => {
    let result = [...suits]

    if (filters.era?.length) {
      result = result.filter((s) => filters.era.includes(s.era))
    }

    if (filters.scope?.length) {
      result = result.filter((s) => filters.scope.includes(s.scope))
    }

    if (filters.status?.length) {
      result = result.filter((s) => filters.status.includes(s.status))
    }

    if (filters.capabilities?.length) {
      result = result.filter((s) =>
        filters.capabilities.every((cap) => s.capability_flags[cap] === true)
      )
    }

    if (filters.search?.trim()) {
      const q = filters.search.toLowerCase().trim()
      result = result.filter(
        (s) =>
          s.designation.toLowerCase().includes(q) ||
          s.nickname.toLowerCase().includes(q) ||
          s.lore.toLowerCase().includes(q) ||
          s.capabilities.some((c) => c.toLowerCase().includes(q))
      )
    }

    return result
  }, [filters])
}

export { suits }
export default useFilteredSuits
