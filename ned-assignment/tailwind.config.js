/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-grey' : '#F9F9F9',
        'button-blue' : '#0E7CF4',
      },
      rotate: {
        '270': '270deg',
      }
    },
  },
  plugins: [],
}

