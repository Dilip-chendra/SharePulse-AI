/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#04060A',
          900: '#07090E',
          850: '#0C0F17',
          800: '#111622',
          750: '#171E2E',
          700: '#1E263B',
          600: '#2A3550',
          500: '#3D4D70',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          dark: '#07090E',
          card: '#0C0F17',
          cardMuted: '#111622',
          border: '#1E263B',
          borderLight: '#2A3550',
          hover: '#171E2E',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Geist', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'data-stream': 'dataStream 20s linear infinite',
        'glow-spin': 'glowSpin 12s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dataStream: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
    },
  },
  plugins: [],
}
