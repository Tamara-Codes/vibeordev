import { supabase } from './supabase'
import type { LeaderboardEntry } from '../types'

/**
 * Shared leaderboard backed by Supabase (`public.scores`). Reads go through a
 * public SELECT policy; writes go through the `submit_score` RPC, which upserts
 * by name (keeping the best score). Every call fails soft — returning `null` —
 * so the hook can fall back to a local board when Supabase is unreachable.
 */

interface ScoreRow {
  id: string
  name: string
  score: number
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
    personaId: r.persona_id,
    personaName: r.persona_name,
    personaEmoji: r.persona_emoji,
    timestamp: Date.parse(r.created_at),
  }
}

/** Top scores, highest first (ties broken by most recent). Null if offline. */
export async function fetchTopScores(
  limit = 100,
): Promise<LeaderboardEntry[] | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('id,name,score,persona_id,persona_name,persona_emoji,created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error || !data) return null
    return (data as ScoreRow[]).map(toEntry)
  } catch {
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
      p_persona_id: entry.personaId,
      p_persona_name: entry.personaName,
      p_persona_emoji: entry.personaEmoji,
    })
    if (error || !data) return null
    // The RPC returns the scores row (possibly wrapped in an array).
    const row = (Array.isArray(data) ? data[0] : data) as ScoreRow
    return toEntry(row)
  } catch {
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
    if (error || !data) return null
    return data.length > 0
  } catch {
    return null
  }
}
