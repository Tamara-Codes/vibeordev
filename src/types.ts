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

export interface Persona {
  id: string
  name: string
  emoji: string
  /** inclusive score range [min, max] */
  min: number
  max: number
  description: string
  /** accent gradient stops as hex (rendered via inline style, not Tailwind
      classes — those get purged when they only appear in this data file) */
  from: string
  to: string
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
