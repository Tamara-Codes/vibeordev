import { useMemo } from 'react'

/**
 * Decorative slow-drifting particles over a subtle grid.
 * Pure CSS animation — cheap, no canvas, respects the dark theme.
 */
export default function ParticleBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        // deterministic-ish spread so it looks intentional
        const left = (i * 37) % 100
        const size = 2 + ((i * 13) % 5)
        const duration = 18 + ((i * 7) % 22)
        const delay = -((i * 11) % 30)
        const violet = i % 2 === 0
        return { left, size, duration, delay, violet, key: i }
      }),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-violet/[0.08] via-transparent to-cyan/[0.06]" />
      {/* soft radial glows */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan/20 blur-[120px]" />
      {particles.map((p) => (
        <span
          key={p.key}
          className="absolute bottom-[-10vh] rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.violet ? '#a78bfa' : '#22d3ee',
            boxShadow: `0 0 ${p.size * 3}px ${p.violet ? '#7c3aed' : '#06b6d4'}`,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
