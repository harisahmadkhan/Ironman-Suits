import { useState, useEffect, useCallback } from 'react'

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
]

export function useKonamiCode(onActivate) {
  const [buffer, setBuffer] = useState([])

  const handler = useCallback((e) => {
    setBuffer(prev => {
      const next = [...prev, e.key].slice(-KONAMI.length)
      if (next.join(',') === KONAMI.join(',')) {
        onActivate()
        return []
      }
      return next
    })
  }, [onActivate])

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}
