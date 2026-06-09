/**
 * Google Analytics 4 (gtag.js) — loaded lazily so we keep a single, public
 * measurement id in one place and can fire typed custom events from the app.
 *
 * The id lives in `VITE_GA_ID` (e.g. `G-XXXXXXXXXX`). When it's unset — local
 * dev, previews, or the course site before it has its own property — every
 * call here is a silent no-op, so we never send phantom hits while testing.
 * The id is not a secret: GA exposes it in the page source of every site.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

/** Inject gtag.js once and configure the property. Safe to call repeatedly. */
export function initAnalytics(): void {
  if (!GA_ID || typeof window === 'undefined') return
  if (window.gtag) return // already initialised

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag relies on the live `arguments` object, so we can't use a rest param.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

/** Fire a custom GA4 event. No-ops when analytics isn't configured. */
export function track(
  event: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', event, params)
}
