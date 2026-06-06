import { useCallback } from 'react'
import useSoundLib from 'use-sound'
import useSoundStore from '@/store/soundStore'

/**
 * Wraps use-sound and respects the global muted state.
 * Falls back silently if the sound file doesn't exist yet.
 *
 * @param {string} src  - path to the sound file in /public/sounds/
 * @param {object} opts - use-sound options (volume, sprite, etc.)
 */
export function useSound(src, opts = {}) {
  const muted = useSoundStore((s) => s.muted)

  const [playFn] = useSoundLib(src || '/sounds/placeholder.mp3', {
    volume: opts.volume ?? 0.5,
    ...opts,
    soundEnabled: !muted && !!src,
  })

  const play = useCallback(() => {
    if (!muted && src) {
      try { playFn() } catch (_) {}
    }
  }, [muted, src, playFn])

  return play
}

export default useSound
