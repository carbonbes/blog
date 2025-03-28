import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },

  content: ['./src/**/*.{html,js,ts,vue}'],

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
        toast: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '70%': { transform: 'translateX(-5%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'toast-swipe-end': {
          '0%': {
            transform: 'translateX(var(--radix-toast-swipe-end-x))',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
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
        hide: {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        loader: {
          '0%': { opacity: 0.2 },
          '25%': { opacity: 0.8, transform: 'scale(1.25)' },
          '50%': { opacity: 0.2 },
        },
      },

      animation: {
        shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
        next: 'next 0.33s',
        'next-reverse': 'next reverse 0.33s',
        previous: 'previous 0.33s',
        'previous-reverse': 'previous reverse 0.33s',
        toast: 'toast .25s ease',
        'fade-in-top-side': 'fade-in-top-side',
        'fade-in-right-side': 'fade-in-right-side',
        'fade-in-bottom-side': 'fade-in-bottom-side',
        'fade-in-left-side': 'fade-in-left-side',
        pulse: 'pulse infinite 3s',
        loader: 'loader',
      },

      fontFamily: {
        sans: ['Roboto, sans-serif'],
      },

      boxShadow: {
        '-sm': '0 -1px 2px 0 rgb(0 0 0 / 0.05)',
        '-': '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '-md':
          '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '-lg':
          '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '-xl':
          '0 -20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '-2xl': '0 -25px 50px -12px rgb(0 0 0 / 0.25)',
      },
    },
  },

  plugins: [
    plugin(function ({ matchUtilities, addVariant }) {
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
      matchUtilities({
        'animation-delay': (value) => {
          return {
            'animation-delay': value,
          }
        },
      })
    }),

    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-drag': {
          '-webkit-user-drag': 'none',
          '-khtml-user-drag': 'none',
          '-moz-user-drag': 'none',
          '-o-user-drag': 'none',
          'user-drag': 'none',
        },
        '.inner-border': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '0',
            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
        },
        '.break-anywhere': {
          'overflow-wrap': 'anywhere',
        },
      })
    }),
  ],
}
