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
      colors: {
        'text': '#fcfdfc',
        'background': '#282c34',
        'primary': '#536558',
        'secondary': '#121614',
        'accent': '#6e8776',
        'card-bg': '#1e2127',
        'card-header': '#2c3038',
        'card-footer': '#1a1d23',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
