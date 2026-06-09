import { useState } from 'react'
import type { Category, LeaderboardEntry, Persona } from '../types'
import ResultCard from '../components/ResultCard'
import ShareButtons from '../components/ShareButtons'
import Leaderboard from '../components/Leaderboard'
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
          <Icon name="sparkles" className="h-4 w-4" /> You're in!
        </p>
        <p className="mt-1 text-sm text-white/60">
          Weekly AI challenges are heading to your inbox.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 card-shadow">
      <p className="font-body font-bold text-white">
        Get weekly AI challenges
      </p>
      <p className="mt-1 text-sm text-white/50">
        One sharp question a week. Level up. No spam.
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
          Subscribe
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/40">
        By subscribing you agree we can email you weekly AI challenges. We store
        your email for this purpose only, never share it, and you can
        unsubscribe any time via the link in every email.
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
  onPlayAgain,
}: ResultProps) {
  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="flex flex-col gap-5">
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
        <EmailCapture />
      </div>
    </div>
  )
}
