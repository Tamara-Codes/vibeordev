import { useEffect } from 'react'
import type { AnswerRecord, Category } from '../types'
import { QUESTION_SECONDS, useQuiz } from '../hooks/useQuiz'
import Timer from './Timer'
import Icon from './icons'

export interface QuizResult {
  score: number
  total: number
  answers: AnswerRecord[]
  weakSpots: Category[]
}

interface QuizProps {
  playerName: string
  onComplete: (result: QuizResult) => void
}

const LETTERS = ['A', 'B', 'C', 'D']

export default function Quiz({ playerName, onComplete }: QuizProps) {
  const q = useQuiz()
  const {
    current,
    index,
    total,
    phase,
    selected,
    score,
    answers,
    weakSpots,
    selectAnswer,
    handleTimeout,
    next,
    isFinished,
  } = q

  useEffect(() => {
    if (isFinished) {
      onComplete({ score, total, answers, weakSpots })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished])

  if (!current) return null

  const progress = ((index + (phase === 'feedback' ? 1 : 0)) / total) * 100
  const isFeedback = phase === 'feedback'

  return (
    <div className="w-full max-w-2xl">
      {/* Header: progress + timer */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-white/50">
            <span>
              Question {index + 1} of {total}
            </span>
            <span className="rounded-full bg-violet/15 px-2.5 py-1 text-violet">
              {current.category}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-white/40">
            {playerName} · {score} correct so far
          </div>
        </div>
        <Timer
          key={index}
          seconds={QUESTION_SECONDS}
          paused={isFeedback}
          onTimeout={handleTimeout}
        />
      </div>

      {/* Question card */}
      <div key={index} className="animate-slideIn">
        <h2 className="mb-6 font-head text-2xl font-bold leading-snug text-white sm:text-3xl">
          {current.question}
        </h2>

        <div className="grid gap-3">
          {current.displayOptions.map((opt, i) => {
            const isCorrect = i === current.correctDisplay
            const isPicked = i === selected
            const showCorrect = isFeedback && isCorrect
            const showWrong = isFeedback && isPicked && !isCorrect

            let cls =
              'border-white/10 bg-card hover:border-violet/60 hover:bg-cardhi'
            if (showCorrect)
              cls = 'border-good bg-good/15 ring-2 ring-good/50'
            else if (showWrong)
              cls = 'border-bad bg-bad/15 ring-2 ring-bad/50 animate-shake'
            else if (isFeedback) cls = 'border-white/10 bg-card opacity-50'

            return (
              <button
                key={i}
                disabled={isFeedback}
                onClick={() => selectAnswer(i)}
                className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${cls} ${
                  !isFeedback ? 'active:scale-[0.99]' : ''
                } ${isPicked && !isFeedback ? 'animate-pulseScale' : ''}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg font-head text-sm font-bold transition ${
                    showCorrect
                      ? 'bg-good text-white'
                      : showWrong
                        ? 'bg-bad text-white'
                        : 'bg-white/10 text-white/70 group-hover:bg-violet group-hover:text-white'
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <span className="flex-1 text-base text-white/90">{opt}</span>
                {showCorrect && (
                  <Icon name="check" className="h-5 w-5 shrink-0 text-good" />
                )}
                {showWrong && (
                  <Icon name="x" className="h-5 w-5 shrink-0 text-bad" />
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        <div
          className={`mt-5 overflow-hidden transition-all duration-300 ${
            isFeedback ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="rounded-xl border border-white/10 bg-base/60 p-4">
            <p className="text-sm leading-relaxed text-white/70">
              <span className="font-semibold text-cyan">
                {selected === null
                  ? "Time's up! "
                  : selected === current.correctDisplay
                    ? 'Correct! '
                    : 'Not quite. '}
              </span>
              {current.explanation}
            </p>
          </div>
        </div>

        {isFeedback && (
          <button
            onClick={next}
            className="animate-fadeUp mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 font-head font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
          >
            {index === total - 1 ? 'See results' : 'Next question'}
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
