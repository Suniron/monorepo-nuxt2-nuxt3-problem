// Services
import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import type { Store } from 'vuex'
import { refreshTokenService } from '~/services/auth'

export default async ({ $axios, store }: { $axios: NuxtAxiosInstance; store: Store<any> }) => {
  try {
    if (store.getters['user/isLoggedIn'])
      return

    // Start the app loading:
    store.commit('CHANGE_IS_LOADING', true)

    const { accessToken, user } = await refreshTokenService($axios)
    store.dispatch('user/authorize', {
      accessToken,
      user,
    })
  }
  catch (error) {
    // Silently fail
    console.error(error)
  }
  finally {
    // End the app loading:
    store.commit('CHANGE_IS_LOADING', false)
  }
}
