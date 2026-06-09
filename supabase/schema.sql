-- Vibe Coder or True Dev? — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.

-- ---------------------------------------------------------------------------
-- Counters: one row per named counter. Currently just the global play count.
-- ---------------------------------------------------------------------------
create table if not exists public.counters (
  name  text primary key,
  value bigint not null default 0
);

-- Seed the play counter at zero — the count reflects real plays only.
insert into public.counters (name, value)
values ('plays', 0)
on conflict (name) do nothing;

alter table public.counters enable row level security;

-- Anyone (the anon role) may READ counter values...
drop policy if exists "counters are readable" on public.counters;
create policy "counters are readable"
  on public.counters for select
  using (true);

-- ...but writes happen only through this atomic, security-definer function,
-- so the anon role never gets direct UPDATE rights on the table.
create or replace function public.bump_counter(counter_name text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_value bigint;
begin
  update public.counters
     set value = value + 1
   where name = counter_name
  returning value into new_value;
  return new_value;
end;
$$;

grant execute on function public.bump_counter(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Scores: the shared leaderboard. One row per player name (case-insensitive),
-- keeping their best score. `name_key` enforces global username uniqueness.
-- ---------------------------------------------------------------------------
create table if not exists public.scores (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  name_key      text generated always as (lower(btrim(name))) stored unique,
  score         int  not null constraint scores_score_range check (score >= 0 and score <= 20),
  -- Total quiz time in ms. Tiebreaker for equal scores: faster ranks higher.
  time_ms       int  not null default 0 constraint scores_time_nonneg check (time_ms >= 0),
  persona_id    text not null,
  persona_name  text not null,
  persona_emoji text not null,
  created_at    timestamptz not null default now()
);

-- Add time_ms to tables created before the speed tiebreaker existed.
alter table public.scores add column if not exists time_ms int not null default 0;
alter table public.scores drop constraint if exists scores_time_nonneg;
alter table public.scores add constraint scores_time_nonneg check (time_ms >= 0);

-- Bound the score to the real quiz range (20 questions). Caps how far a
-- tampered anon RPC call can inflate a leaderboard entry. Re-applied here so
-- running this script against an already-created table also gets the cap.
alter table public.scores drop constraint if exists scores_score_range;
alter table public.scores
  add constraint scores_score_range check (score >= 0 and score <= 20);

alter table public.scores enable row level security;

-- Anyone may READ the leaderboard...
drop policy if exists "scores are readable" on public.scores;
create policy "scores are readable"
  on public.scores for select
  using (true);

-- ...but inserts/updates go only through this function (no direct write grant),
-- which upserts by name keeping the player's BEST run. "Better" = higher score,
-- or the same score in less time — so replays don't duplicate and the leaderboard
-- shows each player's strongest result.
--
-- The old 5-arg version is dropped first: adding p_time_ms changes the signature,
-- which would otherwise create a second overloaded function rather than replace it.
drop function if exists public.submit_score(text, int, text, text, text);

create or replace function public.submit_score(
  p_name text,
  p_score int,
  p_time_ms int,
  p_persona_id text,
  p_persona_name text,
  p_persona_emoji text
)
returns public.scores
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.scores;
begin
  insert into public.scores (name, score, time_ms, persona_id, persona_name, persona_emoji)
  values (btrim(p_name), p_score, greatest(p_time_ms, 0), p_persona_id, p_persona_name, p_persona_emoji)
  on conflict (name_key) do update set
    -- The incoming run wins on a strictly higher score, or an equal score with
    -- a faster time. Every field below moves together based on this test.
    score         = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then excluded.score else public.scores.score end,
    time_ms       = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then excluded.time_ms else public.scores.time_ms end,
    persona_id    = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then excluded.persona_id else public.scores.persona_id end,
    persona_name  = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then excluded.persona_name else public.scores.persona_name end,
    persona_emoji = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then excluded.persona_emoji else public.scores.persona_emoji end,
    created_at    = case when excluded.score >  public.scores.score
                          or (excluded.score = public.scores.score and excluded.time_ms < public.scores.time_ms)
                         then now() else public.scores.created_at end
  returning * into result;
  return result;
end;
$$;

grant execute on function public.submit_score(text, int, int, text, text, text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Subscribers: weekly-challenge email signups. Anon may add an address but may
-- NOT read the list — you read/export it from the Supabase dashboard.
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  email_key  text generated always as (lower(btrim(email))) stored unique,
  created_at timestamptz not null default now()
);

-- RLS on with no policies = no direct access for anon; the function below
-- (security definer) is the only way in, and it can't read anything back.
alter table public.subscribers enable row level security;

create or replace function public.add_subscriber(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscribers (email)
  values (btrim(p_email))
  on conflict (email_key) do nothing;
end;
$$;

grant execute on function public.add_subscriber(text) to anon, authenticated;
