/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gamemania-gradient': 'linear-gradient(to top right, #CD335F, #A15591, #717AC9, #4999F6)',
      },
      colors:{
        'custom-gradient-start': 'rgba(255, 255, 255, 0.01)', 
        'custom-gradient-end': 'rgba(153, 153, 153, 0.2)',
      },
      fontFamily: {
        'monckeberg': ['Monckeberg', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'adam': ['Adam', 'sans-serif'],
      },
      keyframes: {
        translateY: {
          '0%': { transform: 'translateY(-90px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
      animation: {
        'translate-y': 'translateY 1s ease-in-out',
      },
    },
  },
  plugins: [],
}

