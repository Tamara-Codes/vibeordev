/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f1a',
        card: '#141726',
        cardhi: '#1c2030',
        violet: '#7c3aed',
        cyan: '#06b6d4',
        amber: '#f59e0b',
        good: '#10b981',
        bad: '#ef4444',
      },
      fontFamily: {
        head: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        pulseScale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        tensePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-120vh)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(124,58,237,0.35)' },
          '50%': { boxShadow: '0 0 48px rgba(6,182,212,0.55)' },
        },
        tickerIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.45s cubic-bezier(0.22,1,0.36,1)',
        fadeUp: 'fadeUp 0.5s ease-out both',
        shake: 'shake 0.4s ease-in-out',
        pulseScale: 'pulseScale 0.35s ease-out',
        tensePulse: 'tensePulse 0.6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        tickerIn: 'tickerIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
