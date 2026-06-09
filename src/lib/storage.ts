/** Tiny typed wrapper around localStorage with JSON + SSR/quota safety. */

export const KEYS = {
  // v3: removed all seed data — the board now starts empty (real plays only).
  leaderboard: 'vctd:leaderboard:v3',
  // v2: reset the local fallback count to a true zero base (the old key was
  // seeded from a fake ~3,241 starting value).
  playCount: 'vctd:playCount:v2',
  // Set once a device has been counted, so replays don't inflate the count.
  counted: 'vctd:counted',
  emails: 'vctd:emails',
  name: 'vctd:lastName',
  streakLast: 'vctd:streakLastDay',
  streakCount: 'vctd:streakCount',
} as const

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function readNumber(key: string, fallback: number): number {
  const n = Number(localStorage.getItem(key))
  return Number.isFinite(n) && localStorage.getItem(key) != null ? n : fallback
}

/** YYYY-MM-DD in local time, for day-streak comparisons. */
export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
