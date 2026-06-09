/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (Project Settings → API). */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase public anon key — safe to expose; access is governed by RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
