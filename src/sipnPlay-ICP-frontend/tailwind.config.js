/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-gradient-start': 'rgba(255, 255, 255, 0.01)', // example rgba color
        'custom-gradient-end': 'rgba(153, 153, 153, 0.2)',
      },
      fontFamily: {
        'monckeberg': ['Monckeberg', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'adam': ['Adam', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

