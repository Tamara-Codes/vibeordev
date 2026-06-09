import Quiz, { type QuizResult } from '../components/Quiz'

interface QuizPageProps {
  playerName: string
  onComplete: (result: QuizResult) => void
}

export default function QuizPage({ playerName, onComplete }: QuizPageProps) {
  return (
    <div className="flex w-full justify-center">
      <Quiz playerName={playerName} onComplete={onComplete} />
    </div>
  )
}
