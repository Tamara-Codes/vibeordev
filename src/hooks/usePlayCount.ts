import { useCallback, useEffect, useState } from 'react'
import { KEYS, readNumber } from '../lib/storage'
import { bumpCount, getCount } from '../lib/counter'

/** Starting point when no count exists yet — the true count begins at zero. */
const LOCAL_BASE = 0

/**
 * The "Join X developers" counter.
 *
 * Prefers the real, global count from the serverless endpoint. If that is
 * unavailable (local dev, offline, not yet deployed) it transparently falls
 * back to a per-device localStorage count so the UI always shows a number.
 */
export function usePlayCount() {
  const [count, setCount] = useState<number>(() =>
    readNumber(KEYS.playCount, LOCAL_BASE),
  )
  const [isGlobal, setIsGlobal] = useState(false)

  // Pull the authoritative global count on mount.
  useEffect(() => {
    let cancelled = false
    getCount().then((n) => {
      if (!cancelled && n != null) {
        setCount(n)
        setIsGlobal(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const incrementLocal = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1
      try {
        localStorage.setItem(KEYS.playCount, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  /** Record a completed play against the global counter (or local fallback). */
  const increment = useCallback(async () => {
    const n = await bumpCount()
    if (n != null) {
      setCount(n)
      setIsGlobal(true)
    } else {
      incrementLocal()
    }
  }, [incrementLocal])

  return { count, increment, isGlobal }
}
