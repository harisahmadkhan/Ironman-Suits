import { create } from 'zustand'

const useSoundStore = create((set, get) => ({
  muted: false,

  toggleMute: () => set((state) => ({ muted: !state.muted })),

  isMuted: () => get().muted,
}))

export default useSoundStore
