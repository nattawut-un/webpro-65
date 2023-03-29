/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [
    require('tw-elements/dist/plugin')
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ff5f5f',
        'secondary': '#ffc0cb',
        'light': '#ffdee4',
      },
      fontFamily: {
        'mali': ['Mali', 'cursive'],
        'chonburi': ['Chonburi', 'cursive'],
        'pattaya': ['Pattaya', 'sans-serif'],
      },
      backgroundImage: {
        'main': "url('/src/assets/images/food_bg.png')"
      }
    },
  },
  plugins: [],
}
