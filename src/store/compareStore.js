import { create } from 'zustand'

const useCompareStore = create((set, get) => ({
  compareMode: false,
  selectedSuits: [], // array of suit IDs, max 4

  toggleCompareMode: () =>
    set((state) => ({
      compareMode: !state.compareMode,
      selectedSuits: state.compareMode ? [] : state.selectedSuits,
    })),

  toggleSuit: (suitId) =>
    set((state) => {
      const already = state.selectedSuits.includes(suitId)
      if (already) {
        return { selectedSuits: state.selectedSuits.filter((id) => id !== suitId) }
      }
      if (state.selectedSuits.length >= 4) return {} // max 4
      return { selectedSuits: [...state.selectedSuits, suitId] }
    }),

  removeSuit: (suitId) =>
    set((state) => ({
      selectedSuits: state.selectedSuits.filter((id) => id !== suitId),
    })),

  clearSelection: () => set({ selectedSuits: [] }),

  isSelected: (suitId) => get().selectedSuits.includes(suitId),
}))

export default useCompareStore
