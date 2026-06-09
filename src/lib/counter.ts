import { supabase } from './supabase'

/**
 * Global play-count, stored in Supabase (a single row in the `counters`
 * table). Reads go through a public SELECT policy; increments go through the
 * atomic `bump_counter` RPC so the anon role never needs write access to the
 * table directly.
 *
 * Every call fails soft — returning `null` — so the UI can fall back to a
 * local count when Supabase isn't configured or is unreachable.
 */

const COUNTER = 'plays'

function toNumber(v: unknown): number | null {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

/** Read the current global count, or null if unavailable. */
export async function getCount(): Promise<number | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('counters')
      .select('value')
      .eq('name', COUNTER)
      .single()
    if (error || !data) return null
    return toNumber(data.value)
  } catch {
    return null
  }
}

/** Atomically increment the global count and return the new value, or null. */
export async function bumpCount(): Promise<number | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.rpc('bump_counter', {
      counter_name: COUNTER,
    })
    if (error) return null
    return toNumber(data)
  } catch {
    return null
  }
}
