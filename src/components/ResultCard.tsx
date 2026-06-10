import type { Category, Persona } from '../types'
import Icon, { personaIcon } from './icons'
import { fillGradient, textGradient } from '../data/personas'

interface ResultCardProps {
  persona: Persona
  playerName: string
  score: number
  total: number
  percentile: number
  weakSpots: Category[]
  streak: number
}

export default function ResultCard({
  persona,
  playerName,
  score,
  total,
  percentile,
  weakSpots,
  streak,
}: ResultCardProps) {
  return (
    <div className="animate-fadeUp relative overflow-hidden rounded-3xl border border-white/10 bg-card p-8 text-center card-shadow">
      {/* glow backdrop */}
      <div
        style={fillGradient(persona)}
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-[80px]"
      />

      <div className="relative">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          Nice work, {playerName}
        </p>

        <div
          style={fillGradient(persona)}
          className="mx-auto mt-4 grid h-16 w-16 animate-pulseScale place-items-center rounded-2xl text-white shadow-lg sm:h-[72px] sm:w-[72px]"
        >
          <Icon name={personaIcon(persona.id)} className="h-8 w-8 sm:h-9 sm:w-9" />
        </div>
        <h1
          style={textGradient(persona)}
          className="mt-4 font-body text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          {persona.name}
        </h1>

        <p className="mx-auto mt-3 max-w-md font-body text-lg font-bold leading-snug text-white">
          {persona.headline}
        </p>

        {/* Score + percentile */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-base px-6 py-3">
            <div className="font-head text-3xl font-extrabold text-white">
              {score}
              <span className="text-xl text-white/40">/{total}</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-white/40">
              score
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-base px-6 py-3">
            <div className="font-head text-3xl font-extrabold text-cyan">
              {percentile}%
            </div>
            <div className="text-xs uppercase tracking-wider text-white/40">
              better than
            </div>
          </div>
        </div>

        {streak > 1 && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-sm font-semibold text-amber">
            <Icon name="flame" className="h-4 w-4" /> {streak} day streak
          </div>
        )}

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70">
          {persona.description}
        </p>

        {/* Weak spots */}
        {weakSpots.length > 0 && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-base/60 p-4 text-left">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bad/90">
              <Icon name="target" className="h-4 w-4" /> Weak spots
            </p>
            <div className="flex flex-wrap gap-2">
              {weakSpots.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-bad/30 bg-bad/10 px-3 py-1.5 text-sm text-white/80"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
