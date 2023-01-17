import type { Store } from 'vuex'

const authMiddleware = ({ store, redirect }: { store: Store<any>; redirect: (redirectUrl: string) => void }) => {
  if (!store.getters['user/isLoggedWithCredentials'] || !store.getters['user/isFullyConnected'])
    redirect('/sign-in')
}
export default authMiddleware
