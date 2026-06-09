import { useEffect, useRef, useState } from 'react'

interface TimerProps {
  /** total seconds for the question */
  seconds: number
  /** freeze the countdown (e.g. during answer feedback) */
  paused: boolean
  /** fired once when the clock reaches zero */
  onTimeout: () => void
}

const SIZE = 88
const STROKE = 7
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

/**
 * Circular countdown. The arc sweeps from cyan → amber → red as time runs
 * out, and pulses tensely in the final 5 seconds. Reset by remounting with a
 * `key` change from the parent.
 */
export default function Timer({ seconds, paused, onTimeout }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const startRef = useRef<number | null>(null)
  const elapsedBeforePause = useRef(0)
  const firedRef = useRef(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (paused) {
      // bank elapsed time so resuming continues from the same point
      if (startRef.current != null) {
        elapsedBeforePause.current += performance.now() - startRef.current
        startRef.current = null
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      const elapsed =
        elapsedBeforePause.current + (now - startRef.current)
      const left = Math.max(0, seconds - elapsed / 1000)
      setRemaining(left)
      if (left <= 0) {
        if (!firedRef.current) {
          firedRef.current = true
          onTimeout()
        }
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [paused, seconds, onTimeout])

  const frac = Math.max(0, Math.min(1, remaining / seconds))
  const color = frac > 0.5 ? '#06b6d4' : frac > 0.2 ? '#f59e0b' : '#ef4444'
  const tense = remaining <= 5 && remaining > 0 && !paused
  const displaySeconds = Math.ceil(remaining)

  return (
    <div
      className={`relative grid place-items-center ${tense ? 'animate-tensePulse' : ''}`}
      style={{ width: SIZE, height: SIZE }}
      aria-label={`${displaySeconds} seconds remaining`}
      role="timer"
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - frac)}
          style={{
            transition: 'stroke 0.4s linear',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <span
        className="absolute font-head text-2xl font-bold tabular-nums"
        style={{ color }}
      >
        {displaySeconds}
      </span>
    </div>
  )
}
