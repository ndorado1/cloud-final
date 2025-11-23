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
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "success": "#22C55E",
        "danger": "#DC2626",
        "error": "#DC3545",
        "neutral-text": "#6C757D",
        "neutral-border": "#CED4DA",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

