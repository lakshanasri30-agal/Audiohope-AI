/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3854',
          dark: '#0B132B',
          card: '#1C2541',
          teal: '#06D6A0',
          cyan: '#11B5E4',
          purple: '#7209B7',
          coral: '#FF70A6',
          yellow: '#FFD166',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.18)',
        'glow-cyan': '0 0 20px rgba(17, 181, 228, 0.35)',
        'glow-teal': '0 0 20px rgba(6, 214, 160, 0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
