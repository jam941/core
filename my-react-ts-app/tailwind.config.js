/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [],
  theme: {
    extend: {
      height: {
        '1/8': '12.5%',
        
      },
      spacing: {
        '10p': '10%', // Define a new spacing value for 10%
      },
      backgroundColor: {
        'buttonOn':'#1F8FF5'
      },
    },
  },
  plugins: [],
  colors: {
    'text': '#fcfdfc',
    'background': '#282c34',
    'primary': '#536558',
    'secondary': '#121614',
    'accent': '#6e8776',
    
   },
}

