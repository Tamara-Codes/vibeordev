import { useState } from 'react'
import type { Category, LeaderboardEntry, Persona } from '../types'
import ResultCard from '../components/ResultCard'
import ShareButtons from '../components/ShareButtons'
import Leaderboard from '../components/Leaderboard'
import Poll from '../components/Poll'
import Icon from '../components/icons'
import { KEYS, readJSON, writeJSON } from '../lib/storage'
import { addSubscriber } from '../lib/subscribers'

interface ResultProps {
  persona: Persona
  playerName: string
  score: number
  total: number
  percentile: number
  weakSpots: Category[]
  streak: number
  topToday: LeaderboardEntry[]
  topAllTime: LeaderboardEntry[]
  currentId?: string
  /** False when the shared leaderboard save failed (only saved locally). */
  saved?: boolean
  onPlayAgain: () => void
}

function EmailCapture() {
  const [email, setEmail] = useState('')
  // Once subscribed on this device, stay on the confirmation across replays.
  const [done, setDone] = useState(
    () => readJSON<string[]>(KEYS.emails, []).length > 0,
  )

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const submit = () => {
    if (!valid) return
    // Save to the shared Supabase list (fire-and-forget; fails soft offline).
    void addSubscriber(email.trim())
    // Keep a local copy so the form remembers you've subscribed on this device.
    const list = readJSON<string[]>(KEYS.emails, [])
    if (!list.includes(email.trim())) {
      writeJSON(KEYS.emails, [...list, email.trim()])
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-good/30 bg-good/10 p-5 text-center">
        <p className="inline-flex items-center gap-1.5 font-body font-bold text-good">
          <Icon name="sparkles" className="h-4 w-4" /> You're on the list!
        </p>
        <p className="mt-1 text-sm text-white/60">
          I'll email you once — the day the course launches.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 card-shadow">
      <p className="font-body font-bold text-white">
        I'm building a course on this — the actual mechanics of LLMs for
        developers, no fluff.
      </p>
      <p className="mt-1 text-sm text-white/50">
        Drop your email and I'll let you know when it's ready. No spam, just one
        email when it launches.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="flex-1 rounded-xl border border-white/10 bg-base px-4 py-2.5 text-white outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/40"
        />
        <button
          onClick={submit}
          disabled={!valid}
          className="rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 font-body font-bold text-white transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Notify me
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/40">
        By signing up you agree we can email you once when the course launches.
        We store your email for this purpose only, never share it, and you can
        unsubscribe any time via the link in the email.
      </p>
    </div>
  )
}

export default function Result({
  persona,
  playerName,
  score,
  total,
  percentile,
  weakSpots,
  streak,
  topToday,
  topAllTime,
  currentId,
  saved = true,
  onPlayAgain,
}: ResultProps) {
  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="flex flex-col gap-5">
        {!saved && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-bad/30 bg-bad/10 p-4 text-sm text-white/80">
            <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-bad" />
            <span>
              We couldn&apos;t save your score to the shared leaderboard just
              now — it&apos;s saved on this device. Check your connection and
              play again to land on the global board.
            </span>
          </div>
        )}
        <ResultCard
          persona={persona}
          playerName={playerName}
          score={score}
          total={total}
          percentile={percentile}
          weakSpots={weakSpots}
          streak={streak}
        />

        <div className="rounded-3xl border border-white/10 bg-card p-5 card-shadow sm:p-6">
          <p className="mb-3 text-center font-body font-bold text-white">
            Show off your result
          </p>
          <ShareButtons
            score={score}
            total={total}
            personaName={persona.name}
            personaEmoji={persona.emoji}
          />
          <button
            onClick={onPlayAgain}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-base px-5 py-3 font-body font-bold text-white/90 transition hover:border-violet/50 hover:bg-cardhi active:scale-[0.98]"
          >
            <Icon name="rotate" className="h-4 w-4" /> Play Again
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:sticky lg:top-6">
        <Leaderboard
          topToday={topToday}
          topAllTime={topAllTime}
          currentId={currentId}
          total={total}
        />
        <Poll />
        <EmailCapture />
      </div>
    </div>
  )
}
