/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'components/**/*.{vue,js}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'app.{js,ts,vue}',
  ],
  daisyui: {
    themes: [
      {
        light: {
          'accent': '#EA580C',
          'base-100': '#FFFFFF',
          'error': '#ea580c',
          'info': '#b3e4ff',
          'neutral': '#A8A8A8',
          'primary': '#35AA3F',
          'secondary': '#0CA793',
          'success': '#36D399',
          'warning': '#FBBD23',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        primary: '#35AA3F',
        secondary: '#0CA793',
        xgrey: '#B4B4B4',
        xwhite: '#F8F9F9',
      },
    },
  },
}

