import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Shared Supabase client for the whole app.
 *
 * Reads the project URL + public anon key from env. Both are safe to ship in
 * the frontend — access is governed by Row-Level Security policies on the
 * database (see `supabase/schema.sql`).
 *
 * If the env vars aren't set (e.g. local dev before you've created a project),
 * this is `null` and callers fall back to local-only behaviour.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = supabase != null

if (!isSupabaseConfigured) {
  // Loud on purpose: this is the most common production misconfig. `.env.local`
  // is gitignored, so a host that builds from git has no creds unless they're
  // set in its dashboard. Without them every save silently falls back to local.
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] NOT configured — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ' +
      'are missing from this build. Scores and the leaderboard will only use ' +
      'localStorage. Set both in your host env vars and redeploy.',
  )
}
