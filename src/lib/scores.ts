import { supabase } from './supabase'
import type { LeaderboardEntry } from '../types'

/**
 * Shared leaderboard backed by Supabase (`public.scores`). Reads go through a
 * public SELECT policy; writes go through the `submit_score` RPC, which upserts
 * by name (keeping the best score). Every call fails soft — returning `null` —
 * so the hook can fall back to a local board when Supabase is unreachable.
 *
 * Failures are logged (never silently swallowed): a swallowed error once hid a
 * function-signature mismatch (PGRST202) that made every save 404 while the
 * play counter kept incrementing — plays counted, leaderboard stayed empty.
 */

/** Log a soft failure so it's visible in the console (DevTools / Sentry). */
function logSupabaseError(op: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(`[leaderboard] ${op} failed:`, error)
}

interface ScoreRow {
  id: string
  name: string
  score: number
  time_ms: number
  persona_id: string
  persona_name: string
  persona_emoji: string
  created_at: string
}

function toEntry(r: ScoreRow): LeaderboardEntry {
  return {
    id: r.id,
    name: r.name,
    score: r.score,
    timeMs: r.time_ms ?? 0,
    personaId: r.persona_id,
    personaName: r.persona_name,
    personaEmoji: r.persona_emoji,
    timestamp: Date.parse(r.created_at),
  }
}

/** Top scores, best first: highest score, then fastest time, then most recent.
 *  Null if offline. */
export async function fetchTopScores(
  limit = 100,
): Promise<LeaderboardEntry[] | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('scores')
      .select(
        'id,name,score,time_ms,persona_id,persona_name,persona_emoji,created_at',
      )
      .order('score', { ascending: false })
      .order('time_ms', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error || !data) {
      if (error) logSupabaseError('fetchTopScores', error)
      return null
    }
    return (data as ScoreRow[]).map(toEntry)
  } catch (err) {
    logSupabaseError('fetchTopScores', err)
    return null
  }
}

/** Upsert a score by name. Returns the saved row, or null if unavailable. */
export async function submitScore(
  entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>,
): Promise<LeaderboardEntry | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.rpc('submit_score', {
      p_name: entry.name,
      p_score: entry.score,
      p_time_ms: entry.timeMs,
      p_persona_id: entry.personaId,
      p_persona_name: entry.personaName,
      p_persona_emoji: entry.personaEmoji,
    })
    if (error || !data) {
      if (error) logSupabaseError('submitScore', error)
      return null
    }
    // The RPC returns the scores row (possibly wrapped in an array).
    const row = (Array.isArray(data) ? data[0] : data) as ScoreRow
    return toEntry(row)
  } catch (err) {
    logSupabaseError('submitScore', err)
    return null
  }
}

/**
 * Whether a name is already on the board (case-insensitive).
 * Returns null if the check can't run (offline) so callers can decide.
 */
export async function isNameTaken(name: string): Promise<boolean | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('id')
      .eq('name_key', name.trim().toLowerCase())
      .limit(1)
    if (error || !data) {
      if (error) logSupabaseError('isNameTaken', error)
      return null
    }
    return data.length > 0
  } catch (err) {
    logSupabaseError('isNameTaken', err)
    return null
  }
}
