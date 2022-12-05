import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
// import colors from 'vuetify/es5/util/colors'

const isProd = process.env.NODE_ENV === 'production'
const httpsEnabled =
  fs.existsSync(path.resolve(__dirname, 'secrets/server.key')) &&
  fs.existsSync(path.resolve(__dirname, 'secrets/server.crt'))

if (isProd && !httpsEnabled) {
  console.warn(
    '[WARN] Building for production without certificate. Please provide both `server.key` and `server.crt` files.'
  )
}
const server =
  isProd && httpsEnabled
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, 'secrets/server.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'secrets/server.crt'))
        }
      }
    : undefined

export default {
  ssr: false,
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/directives.js',
    { src: '~/plugins/multiTabState.client.js' },
    '~/plugins/init.client.js',
    { src: '~plugins/leaflet.js', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    ['@nuxtjs/eslint-module', { lintDirtyModulesOnly: false, fix: true }],
    '@nuxtjs/vuetify'
  ],
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
        locales: [{ code: 'en', iso: 'en-GB', file: 'en-GB.js' }],
        defaultLocale: 'en',
        lazy: true,
        langDir: 'locales/',
        detectBrowserLanguage: {
          onlyOnRoot: true
        },
        vuex: false,
        vueI18n: {
          fallbackLocale: 'en'
        }
      }
    ]
  ],
  publicRuntimeConfig: {
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
      baseURL: process.env.BACKEND_BASE_URL,
      browserBaseURL: process.env.BACKEND_BROWSER_BASE_URL
    }
  },

  /**
   * Https server for prod
   */
  server,

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/styles/sass/abstracts/vuetify-variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#0C8F10'
        }
      }
    }
    // We are using the dark theme, but the actual colors will be handled
    // using SASS at ~/assets/styles/sass/themes/
    // theme: {
    //   dark: false
    // }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      return {
        ...config,
        plugins: [
          ...(config.plugins ?? []),
          new webpack.DefinePlugin({
            'process.env': {
              PACKAGE_VERSION: `"${require('./package.json').version}"`
            }
          })
        ]
      }
    }
  }
}
