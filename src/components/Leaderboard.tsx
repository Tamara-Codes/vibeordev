import { useState } from 'react'
import type { LeaderboardEntry } from '../types'
import Icon, { personaIcon } from './icons'

/**
 * Gold / silver / bronze accents for the top three ranks, as inline hex.
 * (Tailwind's amber shades are unavailable here — the config overrides `amber`
 * with a single custom color — so the medal colors are set via style instead.)
 */
const RANK_MEDAL = [
  { from: '#fcd34d', to: '#f59e0b', color: '#1a1205' }, // gold
  { from: '#e2e8f0', to: '#94a3b8', color: '#1a1205' }, // silver
  { from: '#d97706', to: '#92400e', color: '#ffffff' }, // bronze
]

/** ms → compact "m:ss" (or "0:00" when no time was recorded). */
function formatTime(ms: number): string {
  const totalSeconds = Math.round((ms ?? 0) / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface LeaderboardProps {
  topToday: LeaderboardEntry[]
  topAllTime: LeaderboardEntry[]
  /** id of the current player's entry, to highlight */
  currentId?: string
  total: number
  /** stretch to fill the parent's height; the list scrolls internally */
  fill?: boolean
}

function Row({
  entry,
  rank,
  highlight,
  total,
}: {
  entry: LeaderboardEntry
  rank: number
  highlight: boolean
  total: number
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
        highlight
          ? 'bg-violet/20 ring-1 ring-violet/50'
          : 'bg-white/[0.03] hover:bg-white/[0.06]'
      }`}
    >
      <span
        style={
          RANK_MEDAL[rank - 1]
            ? {
                backgroundImage: `linear-gradient(135deg, ${RANK_MEDAL[rank - 1].from}, ${RANK_MEDAL[rank - 1].to})`,
                color: RANK_MEDAL[rank - 1].color,
              }
            : undefined
        }
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-head text-xs font-bold tabular-nums ${
          RANK_MEDAL[rank - 1] ? '' : 'text-white/50'
        }`}
      >
        {rank}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium text-white/90">
        {entry.name}
        {highlight && (
          <span className="ml-2 rounded bg-violet px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            you
          </span>
        )}
      </span>
      <span className="shrink-0 text-white/50" title={entry.personaName}>
        <Icon name={personaIcon(entry.personaId)} className="h-4 w-4" />
      </span>
      <span
        className="w-12 shrink-0 text-right text-xs tabular-nums text-white/40"
        title="Time to finish"
      >
        {formatTime(entry.timeMs)}
      </span>
      <span className="w-14 shrink-0 text-right font-head font-bold tabular-nums text-cyan">
        {entry.score}
        <span className="text-xs text-white/40">/{total}</span>
      </span>
    </li>
  )
}

export default function Leaderboard({
  topToday,
  topAllTime,
  currentId,
  total,
  fill = false,
}: LeaderboardProps) {
  const [tab, setTab] = useState<'today' | 'all'>('all')
  const list = tab === 'today' ? topToday : topAllTime

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-card p-5 card-shadow sm:p-6 ${
        fill ? 'flex h-full flex-col' : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-head text-xl font-bold text-white">Leaderboard</h3>
        <div className="flex gap-1 rounded-xl bg-base p-1">
          {(['all', 'today'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tab === t
                  ? 'bg-gradient-to-r from-violet to-cyan text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {t === 'all' ? 'All-Time' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p
          className={`text-center text-sm text-white/40 ${
            fill ? 'flex flex-1 items-center justify-center' : 'py-8'
          }`}
        >
          No scores yet — be the first!
        </p>
      ) : (
        <ol
          className={`scroll-thin flex flex-col gap-1.5 overflow-y-auto ${
            fill ? 'min-h-0 flex-1 max-h-[16rem]' : 'max-h-[22rem]'
          }`}
        >
          {list.map((e, i) => (
            <Row
              key={e.id}
              entry={e}
              rank={i + 1}
              highlight={e.id === currentId}
              total={total}
            />
          ))}
        </ol>
      )}
    </div>
  )
}
