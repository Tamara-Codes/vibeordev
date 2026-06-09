import { useCallback, useMemo, useRef, useState } from 'react'
import type { AnswerRecord, Category, Question } from '../types'
import { questions as RAW } from '../data/questions'

export const QUESTION_SECONDS = 30

export interface ShuffledQuestion extends Question {
  /** options in display order */
  displayOptions: string[]
  /** index into displayOptions that is correct */
  correctDisplay: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(): ShuffledQuestion[] {
  return shuffle(RAW).map((q) => {
    const correctText = q.options[q.correct]
    const displayOptions = shuffle(q.options)
    return {
      ...q,
      displayOptions,
      correctDisplay: displayOptions.indexOf(correctText),
    }
  })
}

export type Phase = 'answering' | 'feedback' | 'finished'

export function useQuiz() {
  const [deck, setDeck] = useState<ShuffledQuestion[]>(() => buildDeck())
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  // When the current question started being answered — used to time each answer.
  const questionStartRef = useRef<number>(performance.now())

  const current = deck[index]
  const total = deck.length

  /** Advance to the next question (or finish). Driven by the Next button. */
  const advance = useCallback(() => {
    setIndex((i) => {
      const next = i + 1
      if (next >= deck.length) {
        setPhase('finished')
        return i
      }
      setPhase('answering')
      setSelected(null)
      questionStartRef.current = performance.now()
      return next
    })
  }, [deck.length])

  const commit = useCallback((record: Omit<AnswerRecord, 'timeMs'>) => {
    // Cap at the question limit so a backgrounded tab can't blow up the total.
    const timeMs = Math.min(
      QUESTION_SECONDS * 1000,
      Math.max(0, performance.now() - questionStartRef.current),
    )
    setAnswers((prev) => [...prev, { ...record, timeMs }])
    setPhase('feedback')
  }, [])

  const selectAnswer = useCallback(
    (displayIdx: number) => {
      if (phase !== 'answering' || !current) return
      setSelected(displayIdx)
      commit({
        questionId: current.id,
        category: current.category,
        correct: displayIdx === current.correctDisplay,
        timedOut: false,
      })
    },
    [phase, current, commit],
  )

  const handleTimeout = useCallback(() => {
    if (phase !== 'answering' || !current) return
    setSelected(null)
    commit({
      questionId: current.id,
      category: current.category,
      correct: false,
      timedOut: true,
    })
  }, [phase, current, commit])

  const restart = useCallback(() => {
    setDeck(buildDeck())
    setIndex(0)
    setPhase('answering')
    setSelected(null)
    setAnswers([])
    questionStartRef.current = performance.now()
  }, [])

  const score = answers.filter((a) => a.correct).length
  const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0)

  /** The two categories with the most wrong answers (need at least 1 wrong). */
  const weakSpots = useMemo<Category[]>(() => {
    const wrong = new Map<Category, number>()
    for (const a of answers) {
      if (!a.correct) wrong.set(a.category, (wrong.get(a.category) ?? 0) + 1)
    }
    return [...wrong.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat)
  }, [answers])

  return {
    current,
    index,
    total,
    phase,
    selected,
    answers,
    score,
    totalTimeMs,
    weakSpots,
    selectAnswer,
    handleTimeout,
    next: advance,
    restart,
    isFinished: phase === 'finished',
  }
}
