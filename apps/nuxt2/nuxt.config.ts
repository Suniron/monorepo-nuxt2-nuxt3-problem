const nuxtConfig: NuxtConfig = {
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
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@the-monorepo/ui',
  ],

  ssr: false,

  target: 'static',

  typescript: {
    typeCheck: false,
  },
}

export default nuxtConfig
