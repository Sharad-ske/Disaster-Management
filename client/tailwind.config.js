/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkNavy: '#0B1220',
        cardNavy: '#111C2E',
        panelNavy: '#17243B',
        borderNavy: '#1E2F4D',
        primaryTeal: '#14B8A6',
        secondaryCyan: '#22D3EE',
        dangerRed: '#EF4444',
        warningOrange: '#F59E0B',
        successGreen: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
