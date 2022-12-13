/**
 *
 * @param {{
 * $axios: import("@nuxtjs/axios").NuxtAxiosInstance,
 * store: import("vuex").Store<any>,
 * redirect: any,
 * app: any,
 * route: any
 * }} args
 */
const axiosPlugin = ({ $axios, store, redirect, app }) => {
  // Configure authentification bearer token, on each request:
  $axios.onRequest((config) => {
    if (store.state.user.accessToken)
      config.headers.Authorization = `Bearer ${store.state.user.accessToken}`
  })

  // To avoid multiple "refresh-token" request
  let refresh = false

  $axios.interceptors.response.use(
    (response) => {
      return response
    },

    // Error handler:
    async (error) => {
      const config = error.config
      // When the access token is expired and the user want to continue use the website.
      // First case : a submit or modify data
      if (
        error.response
        && error.response.status === 401
        && error.response.config.url !== 'refresh-token'
        && error.response.config.url !== 'logout'
        && (error.response.config.method === 'patch'
          || error.response.config.method === 'post'
          || error.response.config.method === 'delete')
        && !error.response.config._retry
      ) {
        if (!refresh) {
          refresh = true
          await refreshToken()
          refresh = false
        }
        config._retry = true
        config.headers.Authorization = `Bearer ${store.state.user.accessToken}`
        return $axios(config)
      } // second case : getter method  with multiple requests
      else if (
        error.response
        && error.response.status === 401
        && error.response.config.url !== 'refresh-token'
        && error.response.config.url !== 'logout'
        && !error.response.config._retry
      ) {
        config._retry = true
        await refreshToken()
        if (
          !app.router.currentRoute.path.startsWith('/sign-in')
          && !app.router.currentRoute.path.startsWith('/reset-password')
        ) {
          if (app.router.currentRoute.fullPath === '/') {
            redirect('/sign-in')
          }
          else {
            app.router.push({
              path: '/sign-in',
              query: {
                redirect: encodeURIComponent(app.router.currentRoute.fullPath),
              },
            })
          }
        }
      }
      // When the refresh token has expired or the user is logout on other page.
      else if (
        error.response.status === 401
        && error.response.config.url !== 'logout'
        && !error.response.config._retry
      ) {
        config._retry = true
        $axios.delete('logout', { withCredentials: true })
        await store.dispatch('user/deauthorize')
        redirect('/sign-in')
      }
      return Promise.reject(error)
    },
  )

  async function refreshToken() {
    console.log('Refreshing access token')
    const response = await $axios.post(
      'refresh-token',
      {},
      { timeout: 4000, withCredentials: true },
    )
    // when the refresh token is good and the user get a new access token.
    const accessToken = response.data.accessToken
    const user = response.data.user
    await store.dispatch('user/authorize', {
      accessToken,
      user,
    })
    return response.status
  }
}

export default axiosPlugin
