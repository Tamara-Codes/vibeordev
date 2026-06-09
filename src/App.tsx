import { useState } from 'react'
import type { Category } from './types'
import ParticleBackground from './components/ParticleBackground'
import NameEntry from './components/NameEntry'
import Landing from './pages/Landing'
import QuizPage from './pages/QuizPage'
import Result from './pages/Result'
import type { QuizResult } from './components/Quiz'
import { useLeaderboard } from './hooks/useLeaderboard'
import { usePlayCount } from './hooks/usePlayCount'
import { useStreak } from './hooks/useStreak'
import { getPersona } from './data/personas'
import { questions } from './data/questions'
import { KEYS } from './lib/storage'

const TOTAL_QUESTIONS = questions.length

type Screen = 'landing' | 'name' | 'quiz' | 'result'

interface FinishedRun {
  result: QuizResult
  percentile: number
  streak: number
  entryId: string
  weakSpots: Category[]
  /** False when the shared (Supabase) save failed and we fell back to local. */
  saved: boolean
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [playerName, setPlayerName] = useState('')
  const [run, setRun] = useState<FinishedRun | null>(null)

  const { addEntry, checkNameTaken, percentileFor, topToday, topAllTime } =
    useLeaderboard()
  const { count: playCount, increment: incrementPlayCount } = usePlayCount()
  const { streak, bumpStreak } = useStreak()

  const handleComplete = async (result: QuizResult) => {
    const persona = getPersona(result.score)
    const percentile = percentileFor(result.score)
    const newStreak = bumpStreak()
    // Count each developer once — replays shouldn't inflate the total.
    if (!localStorage.getItem(KEYS.counted)) {
      void incrementPlayCount()
      try {
        localStorage.setItem(KEYS.counted, '1')
      } catch {
        /* ignore */
      }
    }
    const { entry, saved } = await addEntry({
      name: playerName,
      score: result.score,
      timeMs: result.timeMs,
      personaId: persona.id,
      personaName: persona.name,
      personaEmoji: persona.emoji,
    })
    setRun({
      result,
      percentile,
      streak: newStreak,
      entryId: entry.id,
      weakSpots: result.weakSpots,
      saved,
    })
    setScreen('result')
  }

  const playAgain = () => {
    setRun(null)
    setScreen('name')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-body text-white">
      <ParticleBackground />

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-8 sm:px-6">
        {/* `flex-1 justify-center` centers short screens; because the wrapper
            can still grow, tall content (the result page) scrolls instead of
            being clipped — the failure mode of `justify-center` on <main>. */}
        <div className="flex w-full flex-1 flex-col items-center justify-center">
        {screen === 'landing' && (
          <Landing
            playCount={playCount}
            streak={streak}
            topToday={topToday}
            topAllTime={topAllTime}
            total={TOTAL_QUESTIONS}
            onStart={() => setScreen('name')}
          />
        )}

        {screen === 'name' && (
          <NameEntry
            checkNameTaken={checkNameTaken}
            onStart={(name) => {
              setPlayerName(name)
              setScreen('quiz')
            }}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'quiz' && (
          <QuizPage playerName={playerName} onComplete={handleComplete} />
        )}

        {screen === 'result' && run && (
          <Result
            persona={getPersona(run.result.score)}
            playerName={playerName}
            score={run.result.score}
            total={run.result.total}
            percentile={run.percentile}
            weakSpots={run.weakSpots}
            streak={run.streak}
            topToday={topToday}
            topAllTime={topAllTime}
            currentId={run.entryId}
            saved={run.saved}
            onPlayAgain={playAgain}
          />
        )}
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-white/30">
        Built by Tamara —{' '}
        <a
          href="https://tamara.rocks"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition hover:text-white/60"
        >
          tamara.rocks
        </a>
      </footer>
    </div>
  )
}
