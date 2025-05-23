/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      height: {
        '1/8': '12.5%',
      },
      spacing: {
        '10p': '10%',
      },
      backgroundColor: {
        'buttonOn':'#3B82F6'
      },
      colors: {
        'text': '#fcfdfc',
        'background': '#1a1e24',
        'primary': '#3B82F6',
        'primary-light': '#60A5FA',
        'primary-dark': '#2563EB',
        'secondary': '#121614',
        'accent': '#10B981',
        'accent-light': '#34D399',
        'accent-dark': '#059669',
        'card-bg': '#1e2127',
        'card-header': '#2c3038',
        'card-footer': '#1a1d23',
        'card-border': '#3B82F6',
        'card-hover': '#2c3038',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'success': '#10B981',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(59, 130, 246, 0.06)',
        'button': '0 1px 3px 0 rgba(59, 130, 246, 0.1), 0 1px 2px 0 rgba(59, 130, 246, 0.06)',
        'button-hover': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'filter': 'filter',
        'transform': 'transform',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#fcfdfc',
            h1: {
              color: '#fcfdfc',
            },
            h2: {
              color: '#fcfdfc',
            },
            h3: {
              color: '#fcfdfc',
            },
            strong: {
              color: '#fcfdfc',
            },
            a: {
              color: '#3B82F6',
              '&:hover': {
                color: '#60A5FA',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
