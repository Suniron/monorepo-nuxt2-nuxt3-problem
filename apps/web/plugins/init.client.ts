// Services
import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import type { Store } from 'vuex'
import { refreshTokenService } from '~/services/auth'

export default async ({ $axios, store, redirect }: { $axios: NuxtAxiosInstance; store: Store<any>; redirect: (redirectUrl: string) => void }) => {
  try {
    if (store.getters['user/isLoggedWithCredentials']) {
      // if the user is logged with credentials but not fully connected (two factor), redirect:
      if (!store.getters['user/isFullyConnected'])
        return redirect('/sign-in')

      // Else, do nothing:
      return
    }

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
