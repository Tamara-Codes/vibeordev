import { supabase } from './supabase'

/**
 * Course-topic poll. Votes reuse the `counters` table (one row per option,
 * keyed `poll:<id>`) and the atomic `bump_counter` RPC — no extra table needed.
 * Reads go through the public SELECT policy on `counters`.
 *
 * Like the rest of the app, every call fails soft (returns null) so the UI can
 * fall back to a local-only tally when Supabase is unreachable.
 */

export interface PollOption {
  id: string
  label: string
}

export const POLL_QUESTION =
  'Which topic would you most want a deep-dive course on?'

export const POLL_OPTIONS: PollOption[] = [
  { id: 'transformers', label: 'Transformers & Attention' },
  { id: 'tokenization', label: 'Tokenization & Context Windows' },
  { id: 'embeddings', label: 'Embeddings & RAG' },
  { id: 'finetuning', label: 'Fine-tuning & Training' },
  { id: 'agents', label: 'Agents & Tool Use' },
]

const PREFIX = 'poll:'

/** Tally keyed by option id, e.g. { transformers: 12, agents: 5 }. */
export type PollResults = Record<string, number>

function logSupabaseError(op: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(`[poll] ${op} failed:`, error)
}

/** Current vote counts for every option (missing options default to 0). Null if offline. */
export async function getPollResults(): Promise<PollResults | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('counters')
      .select('name,value')
      .like('name', `${PREFIX}%`)
    if (error || !data) {
      if (error) logSupabaseError('getPollResults', error)
      return null
    }
    const known = new Set(POLL_OPTIONS.map((o) => o.id))
    const out: PollResults = {}
    for (const row of data as { name: string; value: number }[]) {
      const id = row.name.slice(PREFIX.length)
      // Ignore stray `poll:*` counters so they can't skew the totals.
      if (known.has(id)) out[id] = Number(row.value) || 0
    }
    return out
  } catch (err) {
    logSupabaseError('getPollResults', err)
    return null
  }
}

/** Record a vote for an option; returns the option's new count, or null. */
export async function votePoll(optionId: string): Promise<number | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.rpc('bump_counter', {
      counter_name: `${PREFIX}${optionId}`,
    })
    if (error) {
      logSupabaseError('votePoll', error)
      return null
    }
    return Number(data) || 0
  } catch (err) {
    logSupabaseError('votePoll', err)
    return null
  }
}
