/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          teal: '#14B8A6',
          indigo: '#6366F1',
          obsidian: '#070A13',
        },
        viber: {
          purple: '#7360F2',
        }
      }
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('light', 'html:not(.dark) &');
    }
  ],
}
