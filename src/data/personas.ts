import type { CSSProperties } from 'react'
import type { Category, Persona } from '../types'

export const personas: Persona[] = [
  {
    id: 'vibe-surfer',
    name: 'Vibe Surfer',
    emoji: '🌊',
    min: 0,
    max: 5,
    headline: 'Pure vibes, zero mechanics. Respect.',
    description:
      "You ship with AI every day and have no idea what's happening under the hood. That's fine — most people faking it are just better at hiding it.",
    from: '#22d3ee',
    to: '#3b82f6',
    cta: {
      mode: 'waitlist',
      headline: 'This stuff is actually learnable.',
      body: "I'm building a course that explains how LLMs and agents really work — no maths, no research papers. Just the clarity to stop nodding along in standups. Get on the list for early-access pricing when it launches.",
      button: 'Get early access',
    },
    share:
      "I scored {score}/{total} on the Vibe Coder or True Dev quiz — turns out I'm running on pure vibes 🌊 Think you actually know how AI works? Prove it:",
  },
  {
    id: 'prompt-monkey',
    name: 'Prompt Monkey',
    emoji: '🤖',
    min: 6,
    max: 9,
    headline: 'You know enough to be dangerous.',
    description:
      "You've got the tools down — the internals are still a black box. The good news: now you know exactly which boxes.",
    from: '#2dd4bf',
    to: '#0ea5e9',
    cta: {
      mode: 'waitlist',
      headline: 'Your weak spots are basically the syllabus.',
      body: 'You lost points on {weakSpots} — which is exactly what my course covers. Tokenization, attention, embeddings, RAG: the stuff that makes everything suddenly click. Early-access pricing for the list.',
      button: 'Get early access',
    },
    share:
      "{score}/{total} on the Vibe Coder or True Dev quiz 🤖 I can prompt my way out of anything, but the internals are still a mystery. Bet you can't do better:",
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatist',
    emoji: '⚡',
    min: 10,
    max: 13,
    headline: "Solid. And you know you're guessing on some of it.",
    description:
      "You understand more than most devs shipping AI today. But there are gaps — and the ones you missed are probably the ones you've been quietly avoiding.",
    from: '#38bdf8',
    to: '#14b8a6',
    cta: {
      mode: 'waitlist',
      headline: 'Turn "I kind of get it" into "I actually understand this."',
      body: 'My course is the conceptual layer behind {weakSpots} — no prompting tips, no fluff, just the real mechanics. Built for exactly where you are right now. Early-access pricing for the list.',
      button: 'Get early access',
    },
    share:
      'Scored {score}/{total} on the Vibe Coder or True Dev quiz ⚡ Solid — but not flawless. How well do YOU actually understand AI?',
  },
  {
    id: 'researcher',
    name: 'The Researcher',
    emoji: '🔬',
    min: 14,
    max: 16,
    headline: "Genuinely impressive. You've done the reading.",
    description:
      "You've got the fundamentals down cold and gone deeper than most — attention, fine-tuning, opinions about tokenizers. From here, it's all about depth.",
    from: '#22d3ee',
    to: '#6366f1',
    cta: {
      mode: 'waitlist',
      headline: 'Want to go deeper?',
      body: "I'm building a course for people who already get the fundamentals — or who want to hand it to a teammate who'd score half this. Join the list if you're curious.",
      button: 'Join the waitlist',
    },
    share:
      "Scored {score}/{total} on the Vibe Coder or True Dev quiz 🔬 Apparently I've done my homework. Think you can match it?",
  },
  {
    id: 'mechanist',
    name: 'The Mechanist',
    emoji: '🔩',
    min: 17,
    max: 19,
    headline: 'Okay — you actually know this. Show-off.',
    description:
      "You're not a vibe coder. You're the real thing — you could explain backpropagation at a dinner party and make it interesting, and you read arXiv for fun.",
    from: '#0ea5e9',
    to: '#4f46e5',
    cta: {
      mode: 'share',
      headline: 'Know someone who would score a 6?',
      body: "That's exactly who my course is for. Send them the quiz above — and if you want to see what I'm building, drop your email.",
      button: 'Keep me posted',
    },
    share:
      "Scored {score}/{total} on the Vibe Coder or True Dev quiz 🔩 Turns out I'm not a vibe coder after all. Can you beat me?",
  },
  {
    id: 'transformer-architect',
    name: 'Transformer Architect',
    emoji: '🧠',
    min: 20,
    max: 20,
    headline: "A perfect score. You're the 1%.",
    description:
      'You could implement GPT-2 from scratch right now, from memory. Either you work at a lab or you really need to go outside more. Either way, we salute you.',
    from: '#3b82f6',
    to: '#4f46e5',
    cta: {
      mode: 'share',
      headline: 'Nothing left to teach you here.',
      body: 'But you clearly love this stuff — so go bait your group chat. Most people will not get {total}/{total}. (Curious what I\'m building? The list is below.)',
      button: 'Keep me posted',
    },
    share:
      'I just got a perfect {score}/{total} on the Vibe Coder or True Dev quiz 🧠 Almost nobody does. Go on — try to match it:',
  },
]

export function getPersona(score: number): Persona {
  return (
    personas.find((p) => score >= p.min && score <= p.max) ?? personas[0]
  )
}

/** "Tokenization and Attention", "Tokenization", or a generic fallback when a
 *  player has no wrong-answer categories (e.g. a perfect score). */
function formatWeakSpots(weakSpots: Category[]): string {
  if (weakSpots.length === 0) return 'the mechanics most people skip'
  if (weakSpots.length === 1) return weakSpots[0]
  return `${weakSpots.slice(0, -1).join(', ')} and ${weakSpots[weakSpots.length - 1]}`
}

/** Interpolate the persona's CTA body with this run's weak spots / total. */
export function ctaBody(
  persona: Persona,
  opts: { weakSpots: Category[]; total: number },
): string {
  return persona.cta.body
    .replace('{weakSpots}', formatWeakSpots(opts.weakSpots))
    .replace(/\{total\}/g, String(opts.total))
}

/** Interpolate the persona's share line with this run's score / total. */
export function shareText(
  persona: Persona,
  opts: { score: number; total: number },
): string {
  return persona.share
    .replace('{score}', String(opts.score))
    .replace('{total}', String(opts.total))
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
