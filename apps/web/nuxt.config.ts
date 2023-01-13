import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import type { NuxtConfig } from '@nuxt/types'
import { version } from './package.json'
// import colors from 'vuetify/es5/util/colors'

const isProd = process.env.NODE_ENV === 'production'
const httpsEnabled
  = fs.existsSync(path.resolve(__dirname, '../../secrets/server.key'))
  && fs.existsSync(path.resolve(__dirname, '../../secrets/server.crt'))

if (isProd && !httpsEnabled) {
  console.warn(
    '[WARN] Building for production without certificate. Please provide both `server.key` and `server.crt` files.',
  )
}
const server
  = isProd && httpsEnabled
    ? {
        https: {
          cert: fs.readFileSync(path.resolve(__dirname, '../../secrets/server.crt')),
          key: fs.readFileSync(path.resolve(__dirname, '../../secrets/server.key')),
        },
      }
    : undefined

const nuxtConfig: NuxtConfig = {
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config) {
      return {
        ...config,
        plugins: [
          ...(config.plugins ?? []),
          new webpack.DefinePlugin({
            'process.env': {
              PACKAGE_VERSION: `"${version}"`,
            },
          }),
        ],
      }
    },
    postcss: {
      plugins: {
        autoprefixer: {},
        tailwindcss: {},
      },
    },
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // ['@nuxtjs/eslint-module', { fix: true, lintDirtyModulesOnly: false }],
    '@nuxtjs/composition-api/module',
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
    '@nuxt/postcss8',
  ],
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.css',
  ],
  /*
  ** Headers of the page
  */
  head: {
    link: [
      { href: '/favicon.ico', rel: 'icon', type: 'image/x-icon' },
      {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      {
        content: 'Xrator helps to manage all your company assets and audit their security vulnerabilities',
        hid: 'description',
        name: 'description',
      },
    ],
    title: 'xrator',
    titleTemplate: '%s - xrator',
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://i18n.nuxtjs.org/
    [
      'nuxt-i18n',
      {
        defaultLocale: 'en',
        detectBrowserLanguage: {
          onlyOnRoot: true,
        },
        langDir: 'locales/',
        lazy: true,
        locales: [{ code: 'en', file: 'en-GB.js', iso: 'en-GB' }],
        vueI18n: {
          fallbackLocale: 'en',
        },
        vuex: false,
      },
    ],
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/directives',
    { src: '~/plugins/multiTabState.client' },
    '~/plugins/init.client',
    { src: '~plugins/leaflet', ssr: false },
  ],

  publicRuntimeConfig: {
    /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
    axios: {
      baseURL: process.env.BACKEND_BASE_URL,
      browserBaseURL: process.env.BACKEND_BROWSER_BASE_URL,
    },
  },

  /**
  * Https server for prod
  */
  server,

  ssr: false,

  target: 'static',

  typescript: {
    typeCheck: false,
  },

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/styles/sass/abstracts/vuetify-variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#0C8F10',
        },
      },
    },
    // We are using the dark theme, but the actual colors will be handled
    // using SASS at ~/assets/styles/sass/themes/
    // theme: {
    //   dark: false
    // }
  },
}

export default nuxtConfig
