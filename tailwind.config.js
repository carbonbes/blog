const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },

  content: [
    "./src/**/*.{html,js,ts,vue}"
  ],

  theme: {
    extend: {
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        next: {
          '0%': { opacity: 0, transform: 'translate3d(100%, 0, 0)' },
          '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        },
        previous: {
          '0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          '100%': { opacity: 0, transform: 'translate3d(-100%, 0, 0)' },
        },
        notification: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '70%': { transform: 'translateX(-5%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'fade-in-top-side': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in-right-side': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in-bottom-side': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        'fade-in-left-side': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },

      animation: {
        shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
        next: 'next 0.2s ease',
        'next-reverse': 'next reverse 0.2s ease',
        previous: 'previous 0.2s ease',
        'previous-reverse': 'previous reverse 0.2s ease',
        notification: 'notification .25s ease',
        'fade-in-top-side': 'fade-in-top-side',
        'fade-in-right-side': 'fade-in-right-side',
        'fade-in-bottom-side': 'fade-in-bottom-side',
        'fade-in-left-side': 'fade-in-left-side',
        pulse: 'pulse infinite 3s'
      },

      fontFamily: {
        sans: ['Roboto, sans-serif'],
      },
    },
  },

  plugins: [
    plugin(
      function ({ addVariant }) {
        addVariant('not-first', '&:not(:first-child)')
        addVariant('not-last', '&:not(:last-child)')
      }
    ),

    plugin(
      function ({ addUtilities }) {
        const noDragUtil = {
          '.no-drag': {
            '-webkit-user-drag': 'none',
            '-khtml-user-drag': 'none',
            '-moz-user-drag': 'none',
            '-o-user-drag': 'none',
            'user-drag': 'none'
          }
        }

        addUtilities(
          noDragUtil
        )
      }
    )
  ],
}
