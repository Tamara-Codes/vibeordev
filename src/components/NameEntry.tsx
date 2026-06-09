import { useState } from 'react'
import { KEYS } from '../lib/storage'

interface NameEntryProps {
  /** checks the shared board; resolves true if the name is taken by someone else */
  checkNameTaken: (name: string, ownName: string) => Promise<boolean>
  onStart: (name: string) => void
  onBack: () => void
}

const MAX = 20

export default function NameEntry({
  checkNameTaken,
  onStart,
  onBack,
}: NameEntryProps) {
  const ownName = (localStorage.getItem(KEYS.name) ?? '').trim()
  const [name, setName] = useState(ownName)
  const [checking, setChecking] = useState(false)
  const [taken, setTaken] = useState(false)

  const trimmed = name.trim()
  const valid = trimmed.length > 0 && !taken && !checking

  const submit = async () => {
    if (trimmed.length === 0 || checking) return
    setChecking(true)
    const isTaken = await checkNameTaken(trimmed, ownName)
    setChecking(false)
    if (isTaken) {
      setTaken(true)
      return
    }
    try {
      localStorage.setItem(KEYS.name, trimmed)
    } catch {
      /* ignore */
    }
    onStart(trimmed)
  }

  return (
    <div className="animate-fadeUp w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 card-shadow">
      <h2 className="font-head text-3xl font-extrabold text-gradient">
        First, who's playing?
      </h2>
      <p className="mt-2 text-sm text-white/60">
        We'll put you on the leaderboard. A first name or handle is perfect.
      </p>

      <label htmlFor="player-name" className="sr-only">
        Display name
      </label>
      <input
        id="player-name"
        autoFocus
        value={name}
        maxLength={MAX}
        placeholder="e.g. Alex or tensor_tom"
        onChange={(e) => {
          setName(e.target.value)
          if (taken) setTaken(false)
        }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className={`mt-6 w-full rounded-xl border bg-base px-4 py-3 text-lg text-white outline-none transition focus:ring-2 ${
          taken
            ? 'border-bad focus:border-bad focus:ring-bad/40'
            : 'border-white/10 focus:border-violet focus:ring-violet/40'
        }`}
      />
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-bad">
          {taken ? 'That name is taken — pick another.' : ''}
        </span>
        <span className="text-white/40">
          {trimmed.length}/{MAX}
        </span>
      </div>

      <button
        onClick={submit}
        disabled={!valid}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 font-head text-lg font-bold text-white transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {checking ? 'Checking…' : "Let's go →"}
      </button>
      <button
        onClick={onBack}
        className="mt-3 w-full text-center text-sm text-white/40 transition hover:text-white/70"
      >
        ← Back
      </button>
    </div>
  )
}
