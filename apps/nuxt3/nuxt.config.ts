// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  typescript: {
    shim: false,
  },
  vite: {
    devBundler: 'legacy',
  },
})
