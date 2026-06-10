export type Category =
  | 'Fundamentals'
  | 'Transformers & Attention'
  | 'Tokenization'
  | 'Models & Benchmarks'
  | 'Prompting'
  | 'Embeddings & RAG'
  | 'Agents & Tools'
  | 'Training & Fine-tuning'

export interface Question {
  id: number
  category: Category
  question: string
  options: string[]
  /** index into the original `options` array */
  correct: number
  explanation: string
}

export interface PersonaCta {
  /** 'waitlist' = email signup is the primary action; 'share' = the top tiers,
      where sharing is the goal and the email capture takes a softer back seat */
  mode: 'waitlist' | 'share'
  /** bold hook line at the top of the CTA box */
  headline: string
  /** pitch paragraph. `{weakSpots}` is replaced with the player's weak
      categories (or a generic phrase when they have none); `{total}` with the
      question count. */
  body: string
  /** label on the email submit button */
  button: string
}

export interface Persona {
  id: string
  name: string
  emoji: string
  /** inclusive score range [min, max] */
  min: number
  max: number
  /** punchy one-liner shown above the description on the result card */
  headline: string
  description: string
  /** accent gradient stops as hex (rendered via inline style, not Tailwind
      classes — those get purged when they only appear in this data file) */
  from: string
  to: string
  /** conversion copy shown in the email-capture box, tailored per tier */
  cta: PersonaCta
  /** share-link copy. `{score}`/`{total}` are interpolated and the site URL is
      appended by ShareButtons. */
  share: string
}

export interface AnswerRecord {
  questionId: number
  category: Category
  correct: boolean
  /** true when the question timed out with no answer */
  timedOut: boolean
  /** ms spent answering this question (capped at the question time limit) */
  timeMs: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  personaId: string
  personaName: string
  personaEmoji: string
  /** total time to complete the quiz, in ms — the tiebreaker for equal scores */
  timeMs: number
  /** epoch ms */
  timestamp: number
}
