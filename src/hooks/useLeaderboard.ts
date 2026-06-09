import { useCallback, useEffect, useState } from 'react'
import type { LeaderboardEntry } from '../types'
import { KEYS, readJSON, writeJSON } from '../lib/storage'
import { fetchTopScores, isNameTaken, submitScore } from '../lib/scores'

const DAY = 86_400_000

/** True when `a` is a better result than `b`: higher score, or same score in
 *  less time. The shared tiebreak rule, reused by sort/dedupe/upsert. */
function isBetter(a: LeaderboardEntry, b: LeaderboardEntry): boolean {
  if (a.score !== b.score) return a.score > b.score
  return (a.timeMs ?? 0) < (b.timeMs ?? 0)
}

/** Collapse duplicate names to one row each, keeping each player's best run. */
function dedupe(list: LeaderboardEntry[]): LeaderboardEntry[] {
  const best = new Map<string, LeaderboardEntry>()
  for (const e of list) {
    const key = e.name.trim().toLowerCase()
    const cur = best.get(key)
    if (!cur || isBetter(e, cur)) best.set(key, e)
  }
  return [...best.values()]
}

/** Local cache of the board — used as the offline fallback / first paint. */
function load(): LeaderboardEntry[] {
  const raw = readJSON<LeaderboardEntry[]>(KEYS.leaderboard, [])
  const cleaned = dedupe(raw)
  if (cleaned.length !== raw.length) writeJSON(KEYS.leaderboard, cleaned)
  return cleaned
}

/** Merge an entry into a local list by name, keeping the higher score. */
function upsertLocal(
  list: LeaderboardEntry[],
  entry: LeaderboardEntry,
): { next: LeaderboardEntry[]; result: LeaderboardEntry } {
  const i = list.findIndex(
    (e) => e.name.trim().toLowerCase() === entry.name.trim().toLowerCase(),
  )
  if (i < 0) return { next: [...list, entry], result: entry }
  // Keep the better run (higher score, or same score but faster). On an exact
  // tie, keep the new row so the player still sees their just-played entry.
  const keepNew = !isBetter(list[i], entry)
  const result = keepNew
    ? entry
    : { ...list[i], id: entry.id, timestamp: entry.timestamp }
  const next = [...list]
  next[i] = result
  return { next, result }
}

const byScore = (a: LeaderboardEntry, b: LeaderboardEntry) =>
  b.score - a.score ||
  (a.timeMs ?? 0) - (b.timeMs ?? 0) ||
  b.timestamp - a.timestamp

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => load())

  // Pull the shared board from Supabase on mount; cache it locally for offline.
  useEffect(() => {
    let cancelled = false
    fetchTopScores().then((rows) => {
      if (!cancelled && rows) {
        setEntries(rows)
        writeJSON(KEYS.leaderboard, rows)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const addEntry = useCallback(
    async (
      entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>,
    ): Promise<LeaderboardEntry> => {
      // Try the shared board first.
      const saved = await submitScore(entry)
      if (saved) {
        const rows = await fetchTopScores()
        if (rows) {
          setEntries(rows)
          writeJSON(KEYS.leaderboard, rows)
        } else {
          setEntries((prev) => upsertLocal(prev, saved).next)
        }
        return saved
      }

      // Offline / Supabase unavailable: fall back to the local board.
      const full: LeaderboardEntry = {
        ...entry,
        id: `e-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        timestamp: Date.now(),
      }
      const { next, result } = upsertLocal(entries, full)
      setEntries(next)
      writeJSON(KEYS.leaderboard, next)
      return result
    },
    [entries],
  )

  /**
   * Whether a name is taken by someone else. Checks the shared board when
   * online, otherwise the local cache. `ownName` (this device's name) is never
   * considered taken, so replaying with your own name is always allowed.
   */
  const checkNameTaken = useCallback(
    async (name: string, ownName: string): Promise<boolean> => {
      const key = name.trim().toLowerCase()
      if (!key || key === ownName.trim().toLowerCase()) return false
      const remote = await isNameTaken(name)
      if (remote != null) return remote
      return entries.some((e) => e.name.trim().toLowerCase() === key)
    },
    [entries],
  )

  /** % of stored scores that this score beats or ties. */
  const percentileFor = useCallback(
    (score: number): number => {
      if (!entries.length) return 50
      const beaten = entries.filter((e) => e.score <= score).length
      return Math.round((beaten / entries.length) * 100)
    },
    [entries],
  )

  const topAllTime = [...entries].sort(byScore).slice(0, 10)
  const topToday = [...entries]
    .filter((e) => Date.now() - e.timestamp < DAY)
    .sort(byScore)
    .slice(0, 10)
  const recentPersonas = [...entries]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)

  return {
    entries,
    addEntry,
    checkNameTaken,
    percentileFor,
    topAllTime,
    topToday,
    recentPersonas,
  }
}
