import { useEffect, useMemo, useState } from 'react'
import {
  getPollResults,
  POLL_OPTIONS,
  POLL_QUESTION,
  votePoll,
  type PollResults,
} from '../lib/poll'
import { KEYS } from '../lib/storage'
import Icon, { type IconName } from './icons'

/** A fitting icon per topic — falls back to a generic chart bar. */
const OPTION_ICON: Record<string, IconName> = {
  transformers: 'network',
  tokenization: 'scissors',
  embeddings: 'database',
  finetuning: 'sliders',
  agents: 'wrench',
}

function readVote(): string | null {
  try {
    return localStorage.getItem(KEYS.pollVote)
  } catch {
    return null
  }
}

export default function Poll() {
  const [voted, setVoted] = useState<string | null>(() => readVote())
  const [results, setResults] = useState<PollResults | null>(null)

  // Pull the shared tally on mount (and whenever a vote lands).
  useEffect(() => {
    let cancelled = false
    getPollResults().then((r) => {
      if (!cancelled && r) setResults(r)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const total = useMemo(
    () =>
      results
        ? Object.values(results).reduce((sum, n) => sum + n, 0)
        : 0,
    [results],
  )

  const choose = async (id: string) => {
    if (voted) return
    // Optimistically reflect the vote so the UI flips to results immediately.
    setVoted(id)
    try {
      localStorage.setItem(KEYS.pollVote, id)
    } catch {
      /* ignore */
    }
    setResults((prev) => ({ ...prev, [id]: (prev?.[id] ?? 0) + 1 }))
    await votePoll(id)
    const fresh = await getPollResults()
    if (fresh) setResults(fresh)
  }

  const showResults = voted != null

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 card-shadow">
      <p className="inline-flex items-center gap-1.5 font-body font-bold text-white">
        <Icon name="graduationCap" className="h-4 w-4 text-cyan" />
        {POLL_QUESTION}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {POLL_OPTIONS.map((opt) => {
          const count = results?.[opt.id] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const mine = voted === opt.id

          if (showResults) {
            return (
              <div
                key={opt.id}
                className={`relative overflow-hidden rounded-xl border px-4 py-2.5 ${
                  mine
                    ? 'border-violet/60 bg-base'
                    : 'border-white/10 bg-base'
                }`}
              >
                {/* Filled bar */}
                <div
                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-700 ease-out ${
                    mine
                      ? 'bg-gradient-to-r from-violet/40 to-cyan/30'
                      : 'bg-white/10'
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-white/90">
                    <Icon
                      name={OPTION_ICON[opt.id] ?? 'barChart'}
                      className="h-4 w-4 shrink-0 text-white/50"
                    />
                    {opt.label}
                    {mine && (
                      <Icon name="check" className="h-3.5 w-3.5 text-violet" />
                    )}
                  </span>
                  <span className="shrink-0 font-bold tabular-nums text-white/70">
                    {pct}%
                  </span>
                </div>
              </div>
            )
          }

          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-base px-4 py-2.5 text-left text-sm text-white/90 transition hover:border-violet/60 hover:bg-cardhi active:scale-[0.99]"
            >
              <Icon
                name={OPTION_ICON[opt.id] ?? 'barChart'}
                className="h-4 w-4 shrink-0 text-white/50 transition group-hover:text-cyan"
              />
              {opt.label}
            </button>
          )
        })}
      </div>

      {showResults && (
        <p className="mt-3 text-xs text-white/40">
          {total > 0
            ? `Thanks for voting! ${total} ${total === 1 ? 'vote' : 'votes'} so far.`
            : 'Thanks for voting!'}
        </p>
      )}
    </div>
  )
}
