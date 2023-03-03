/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ff5f5f',
        'secondary': '#ffc0cb',
      },
      fontFamily: {
        'mali': ['Mali', 'cursive'],
        'chonburi': ['Chonburi', 'cursive'],
        'pattaya': ['Pattaya', 'sans-serif'],
      },
      backgroundImage: {
        'main': "url('/src/images/food_bg.png')"
      }
    },
  },
  plugins: [],
}
