/** @type {import('tailwindcss').Config} */
export default {
  content: [],
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
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        previous: {
          '0%': { opacity: 1, transform: 'translateX(0)' },
          '100%': { opacity: 0, transform: 'translateX(-100%)' }
        },
        notification: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '70%': { transform: 'translateX(-5%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      },

      animation: {
        shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
        next: 'next .25s',
        'next-reverse': 'next reverse .25s',
        previous: 'previous .25s',
        'previous-reverse': 'previous reverse .25s',
        notification: 'notification .25s ease',
      },

      fontFamily: {
        sans: ['Roboto, sans-serif']
      },
    },
  },
  plugins: [],
}

