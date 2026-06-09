/** Public URL used in share links (not the dev localhost address). */
const SITE_URL = 'https://truedevquiz.com'

interface ShareButtonsProps {
  score: number
  total: number
  personaName: string
  personaEmoji: string
}

export default function ShareButtons({
  score,
  total,
  personaName,
  personaEmoji,
}: ShareButtonsProps) {
  const text = `I scored ${score}/${total} on the Vibe Coder or True Dev quiz — I'm${personaEmoji}${personaName}. Are you a vibe coder or do you actually know your stuff? ${SITE_URL}`
  const url = SITE_URL

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url,
  )}&summary=${encodeURIComponent(text)}`

  const open = (href: string) =>
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600')

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        onClick={() => open(twitterHref)}
        className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-body font-bold text-black transition hover:brightness-90 active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>
      <button
        onClick={() => open(linkedInHref)}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0a66c2] px-5 py-3 font-body font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share on LinkedIn
      </button>
    </div>
  )
}
