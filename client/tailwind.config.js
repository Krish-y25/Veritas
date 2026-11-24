/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#141e33',
          700: '#1e293b',
        },
      },
    },
  },
  plugins: [],
};
