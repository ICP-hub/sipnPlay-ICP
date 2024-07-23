/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'monckeberg': ['Monckeberg', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'adam': ['Adam', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

