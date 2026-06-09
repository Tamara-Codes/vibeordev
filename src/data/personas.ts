import type { CSSProperties } from 'react'
import type { Persona } from '../types'

export const personas: Persona[] = [
  {
    id: 'vibe-surfer',
    name: 'Vibe Surfer',
    emoji: '🌊',
    min: 0,
    max: 5,
    description:
      "You've shipped more than you've studied, and honestly? Respect. You don't know what a gradient is but your apps somehow work. The vibes are strong with this one.",
    from: '#22d3ee',
    to: '#3b82f6',
  },
  {
    id: 'prompt-monkey',
    name: 'Prompt Monkey',
    emoji: '🤖',
    min: 6,
    max: 9,
    description:
      "You've discovered that you can get the model to do most things if you ask nicely enough. You know the tools but the internals are a mystery. That's fine. Most of the time.",
    from: '#2dd4bf',
    to: '#0ea5e9',
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatist',
    emoji: '⚡',
    min: 10,
    max: 13,
    description:
      "You know enough to be dangerous. You've read a few papers, you understand the basics, and you ship things that actually work. The sweet spot of the modern dev.",
    from: '#38bdf8',
    to: '#14b8a6',
  },
  {
    id: 'researcher',
    name: 'The Researcher',
    emoji: '🔬',
    min: 14,
    max: 16,
    description:
      "You've gone deeper than most. You understand attention, you've fine-tuned a model or two, and you have opinions about tokenizers. Colleagues come to you with questions.",
    from: '#22d3ee',
    to: '#6366f1',
  },
  {
    id: 'mechanist',
    name: 'The Mechanist',
    emoji: '🔩',
    min: 17,
    max: 19,
    description:
      "You could explain backpropagation at a dinner party and make it interesting. You read arXiv for fun. You have a strong opinion on whether transformers are overrated.",
    from: '#0ea5e9',
    to: '#4f46e5',
  },
  {
    id: 'transformer-architect',
    name: 'Transformer Architect',
    emoji: '🧠',
    min: 20,
    max: 20,
    description:
      'You are the 1%. You could implement GPT-2 from scratch right now, from memory. Either you work at a lab or you really need to go outside more. Either way, we salute you.',
    from: '#3b82f6',
    to: '#4f46e5',
  },
]

export function getPersona(score: number): Persona {
  return (
    personas.find((p) => score >= p.min && score <= p.max) ?? personas[0]
  )
}

/** Solid gradient fill (for icon tiles / glows). */
export function fillGradient(p: Persona): CSSProperties {
  return { backgroundImage: `linear-gradient(135deg, ${p.from}, ${p.to})` }
}

/** Gradient applied to text via background-clip. */
export function textGradient(p: Persona): CSSProperties {
  return {
    backgroundImage: `linear-gradient(90deg, ${p.from}, ${p.to})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }
}
