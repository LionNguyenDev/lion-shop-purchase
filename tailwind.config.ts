import type { Config } from 'tailwindcss';

// Tokens come from design-system/lion-shopping/MASTER.md (ui-ux-pro-max)
const config: Config = {
  // Dark mode is only switchable on the landing page; other routes are forced to light (see providers.tsx)
  darkMode: 'class',
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          soft: 'rgb(var(--color-primary-soft) / <alpha-value>)',
          foreground: 'rgb(var(--color-on-primary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
          foreground: 'rgb(var(--color-on-accent) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive) / <alpha-value>)',
          soft: 'rgb(var(--color-destructive-soft) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'none' } },
        'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'none' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        bump: { '0%, 100%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.3)' } },
        // Landing page
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        wave: {
          '0%, 60%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        draw: { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Light streak crossing the shop banner every few seconds
        sweep: { '0%': { transform: 'translateX(-120%)' }, '55%, 100%': { transform: 'translateX(120%)' } },
        // Floating chat buttons (FLOATING_CHAT_BUTTONS.md): bounce up with a slight overshoot
        'chat-pop': {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(12px)' },
          '60%': { transform: 'scale(1.03) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        // Entrances decelerate (ease-out); durations scale with distance travelled
        'fade-up': 'fade-up 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 200ms ease-out both',
        'scale-in': 'scale-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slide-in-left 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        bump: 'bump 320ms ease-out',
        blob: 'blob 14s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        wave: 'wave 2.4s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'spin-slow-reverse': 'spin 24s linear infinite reverse',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'fade-up-slow': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        draw: 'draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.4s both',
        'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
        'chat-pop': 'chat-pop 0.7s cubic-bezier(0.2, 0.8, 0.3, 1.2) backwards',
        sweep: 'sweep 4s ease-in-out infinite',
        heartbeat: 'bump 1.4s ease-in-out infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px rgb(15 23 42 / 0.05)',
        lift: '0 12px 32px rgb(15 23 42 / 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
