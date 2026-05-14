/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#3B82F6', dark: '#1D4ED8', light: '#93C5FD' }
      }
    }
  },
  plugins: [],
}
