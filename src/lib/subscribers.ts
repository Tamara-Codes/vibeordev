import { supabase } from './supabase'

/**
 * Weekly-challenge email signups, stored in Supabase (`public.subscribers`)
 * via the `add_subscriber` RPC. The anon role can add an address but cannot
 * read the list — export it from the Supabase dashboard. Returns false when
 * Supabase isn't configured/reachable so the caller can fall back locally.
 */
export async function addSubscriber(email: string): Promise<boolean> {
  if (!supabase) return false
  try {
    const { error } = await supabase.rpc('add_subscriber', {
      p_email: email.trim(),
    })
    return !error
  } catch {
    return false
  }
}
