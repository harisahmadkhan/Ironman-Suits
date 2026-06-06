/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':           'var(--bg-base)',
        'bg-panel':          'var(--bg-panel)',
        'bg-card':           'var(--bg-card)',
        'border-glow':       'var(--border-glow)',
        'accent-red':        'var(--accent-red)',
        'accent-gold':       'var(--accent-gold)',
        'text-primary':      'var(--text-primary)',
        'text-secondary':    'var(--text-secondary)',
        'text-mono':         'var(--text-mono)',
        'status-active':     'var(--status-active)',
        'status-destroyed':  'var(--status-destroyed)',
        'status-decom':      'var(--status-decommissioned)',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow:    '0 0 12px rgba(0,212,255,0.15), inset 0 0 12px rgba(0,212,255,0.05)',
        'glow-lg':'0 0 24px rgba(0,212,255,0.3), inset 0 0 24px rgba(0,212,255,0.1)',
      },
      keyframes: {
        'arc-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'scan-line': {
          '0%':   { top: '0%', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      animation: {
        'arc-pulse':    'arc-pulse 2s ease-in-out infinite',
        float:          'float 4s ease-in-out infinite',
        'scan-line':    'scan-line 1.5s linear',
        'blink-cursor': 'blink-cursor 1s step-end infinite',
      },
    },
  },
  plugins: [],
}

