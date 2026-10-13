import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0a0a0a',
          soft: '#f4f4f6',
        },
        accent: {
          DEFAULT: '#635bff',
          hi: '#7c74ff',
          lo: '#4f46e5',
          soft: '#eeecff',
        },
        ink: {
          DEFAULT: '#0b0b12',
          2: '#4b4b58',
          3: '#7d7d8a',
        },
        line: '#e8e8ee',
        canvas: '#fafafc',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,16,28,0.04), 0 10px 30px -12px rgba(16,16,28,0.10)',
        lift: '0 2px 4px rgba(16,16,28,0.04), 0 24px 48px -20px rgba(16,16,28,0.20)',
        pop: '0 12px 40px -12px rgba(99,91,255,0.35)',
        glow: '0 30px 80px -30px rgba(99,91,255,0.55)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%,4%,0) scale(1.08)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        ping2: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        drift: 'drift 18s ease-in-out infinite',
        'drift-slow': 'drift 26s ease-in-out infinite reverse',
        ping2: 'ping2 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
