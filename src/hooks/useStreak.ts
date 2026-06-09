import { useCallback, useState } from 'react'
import { KEYS, dayKey, readNumber } from '../lib/storage'

/**
 * Day-streak tracking. `streak` is the current consecutive-day count.
 * Call `bumpStreak()` when a quiz is completed to record today's play.
 */
export function useStreak() {
  const [streak, setStreak] = useState<number>(() =>
    readNumber(KEYS.streakCount, 0),
  )

  const bumpStreak = useCallback(() => {
    const today = dayKey()
    const last = localStorage.getItem(KEYS.streakLast)
    const prevCount = readNumber(KEYS.streakCount, 0)

    let next: number
    if (last === today) {
      next = prevCount || 1 // already played today, keep count
    } else {
      const yesterday = dayKey(new Date(Date.now() - 86_400_000))
      next = last === yesterday ? prevCount + 1 : 1
    }

    try {
      localStorage.setItem(KEYS.streakLast, today)
      localStorage.setItem(KEYS.streakCount, String(next))
    } catch {
      /* ignore */
    }
    setStreak(next)
    return next
  }, [])

  return { streak, bumpStreak }
}
