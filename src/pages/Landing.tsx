import type { Category, LeaderboardEntry } from '../types'
import Icon, { type IconName } from '../components/icons'
import Leaderboard from '../components/Leaderboard'

interface LandingProps {
  playCount: number
  streak: number
  topToday: LeaderboardEntry[]
  topAllTime: LeaderboardEntry[]
  total: number
  onStart: () => void
}

const CATEGORIES: { label: Category; icon: IconName }[] = [
  { label: 'Fundamentals', icon: 'graduationCap' },
  { label: 'Transformers & Attention', icon: 'network' },
  { label: 'Tokenization', icon: 'scissors' },
  { label: 'Models & Benchmarks', icon: 'barChart' },
  { label: 'Prompting', icon: 'terminal' },
  { label: 'Embeddings & RAG', icon: 'database' },
  { label: 'Agents & Tools', icon: 'bot' },
  { label: 'Training & Fine-tuning', icon: 'sliders' },
]

function TopicCoverage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5 card-shadow sm:p-6">
      <h3 className="font-head text-xl font-bold text-white">
        What you'll be tested on
      </h3>
      <p className="mt-1 text-sm text-white/50">
        {CATEGORIES.length} topics across modern AI &amp; LLMs.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5 transition hover:bg-white/[0.06]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan">
              <Icon name={c.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="text-sm font-medium text-white/80">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Landing({
  playCount,
  streak,
  topToday,
  topAllTime,
  total,
  onStart,
}: LandingProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center text-center">
      {streak > 1 && (
        <div className="animate-fadeUp mb-6 inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-sm font-semibold text-amber">
          <Icon name="flame" className="h-4 w-4" /> {streak} day streak — keep it
          alive
        </div>
      )}

      <div className="animate-fadeUp mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-1.5 text-xs font-medium text-white/60">
        The AI knowledge check for developers
      </div>

      <h1 className="animate-fadeUp font-head text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
        Are You a <span className="text-gradient">Vibe Coder</span>
        <br />
        or a <span className="text-gradient">True Dev</span>?
      </h1>

      <p
        className="animate-fadeUp mt-4 max-w-xl text-lg text-white/60"
        style={{ animationDelay: '0.05s' }}
      >
        20 questions. 30 seconds each. Find out where you really stand.
      </p>

      <button
        onClick={onStart}
        style={{ animationDelay: '0.1s' }}
        className="animate-fadeUp mt-6 animate-glow rounded-2xl bg-gradient-to-r from-violet to-cyan px-10 py-4 font-head text-xl font-bold text-white transition hover:brightness-110 active:scale-[0.97]"
      >
        Start the Quiz →
      </button>

      <p
        className="animate-fadeUp mt-4 text-sm text-white/40"
        style={{ animationDelay: '0.15s' }}
      >
        Join{' '}
        <span className="font-semibold text-white/70">
          {playCount.toLocaleString()}
        </span>{' '}
        developers who've taken the test
      </p>

      {/* Two-column preview: what the quiz covers + who's winning.
          Equal height via grid stretch; the leaderboard scrolls internally. */}
      <div
        className="animate-fadeUp mt-8 grid w-full gap-6 text-left lg:grid-cols-2"
        style={{ animationDelay: '0.2s' }}
      >
        <TopicCoverage />
        <Leaderboard
          topToday={topToday}
          topAllTime={topAllTime}
          total={total}
          fill
        />
      </div>
    </div>
  )
}
