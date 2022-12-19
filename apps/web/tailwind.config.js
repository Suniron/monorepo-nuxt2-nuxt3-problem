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
      boxShadow: {
        'neu-card':
          '16px 17px 11px -4px rgba(0,0,0,0.1),-10px -10px 15px 4px rgba(255,255,255,0.4);',
        'neum-green': '8px 8px 20px #35AA3F, -8px -8px 20px #ffffff;',
        'neumorphism':
          '7px 12px 8px -9px rgba(0,0,0,0.1),-5px -9px 8px -9px rgba(255,255,255,0.4);',
      },
      colors: {
        primary: '#35AA3F',
        secondary: '#0CA793',
        xgrey: '#B4B4B4',
        xwhite: '#F8F9F9',
      },
    },
  },
}

