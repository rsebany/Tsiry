/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          soft: 'var(--border-soft)',
        },
        input: 'var(--input)',
        ring: 'var(--focus)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        green: {
          DEFAULT: 'var(--green)',
          dark: 'var(--green-dark)',
          deep: 'var(--green-deep)',
          soft: 'var(--green-soft)',
          border: 'var(--green-border)',
        },
        red: {
          DEFAULT: 'var(--red)',
          dark: 'var(--red-dark)',
          soft: 'var(--red-soft)',
          border: 'var(--red-border)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          soft: 'var(--amber-soft)',
          border: 'var(--amber-border)',
        },
        info: {
          DEFAULT: 'var(--blue-info)',
          soft: 'var(--info-soft)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        text: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        primary: {
          DEFAULT: 'var(--green)',
          foreground: '#fff',
          dark: 'var(--green-dark)',
          deep: 'var(--green-deep)',
        },
        secondary: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--text-2)',
        },
        destructive: {
          DEFAULT: 'var(--red)',
          foreground: '#fff',
        },
        muted: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--green-soft)',
          foreground: 'var(--green-deep)',
        },
        popover: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text)',
        },
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text)',
        },
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        '2xl': 'var(--r-xl)',
        '3xl': 'var(--r-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionTimingFunction: {
        soft: 'var(--ease)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms var(--ease) both',
        'fade-in-up': 'fade-in-up 250ms var(--ease) both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};