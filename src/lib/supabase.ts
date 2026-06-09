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
