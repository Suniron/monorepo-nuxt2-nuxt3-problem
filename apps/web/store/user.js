export const types = {
  CREATE_SESSION: 'CREATE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  MODIFY_SESSION: 'MODIFY_SESSION',
  WRONG_LOGIN: 'WRONG_LOGIN',
}

export const state = () => ({
  accessToken: '',
  email: '',
  firstName: '',
  id: '',
  lastName: '',
  roles: [],
  username: '',
  wrongLogin: false,
})

export const getters = {
  email: state => state.email,
  firstName: state => state.firstName,
  id: state => state.id,
  isAdmin: state => state.roles.includes('admin'),
  isLoggedIn: state => !!(state.accessToken && state.id),
  lastName: state => state.lastName,
  roles: state => state.roles,
  username: state => state.username,
  wrongLogin: state => state.wrongLogin,
}

export const mutations = {
  /**
   *
   * @param {*} state
   * @param {{
   * accessToken: string,
   * user: {
   * id: string,
   * firstName: string,
   * lastName: string,
   * username: string,
   * email: string,
   * roles: "admin"|"user"[]
   * wrongLogin: boolean
   * }}} data
   */
  [types.CREATE_SESSION](state, { accessToken, user }) {
    state.accessToken = accessToken
    state.id = user.id
    state.firstName = user.firstName
    state.lastName = user.lastName
    state.username = user.username
    state.email = user.email
    state.roles = user.roles
  },
  [types.DELETE_SESSION](state) {
    state.accessToken = ''
    state.id = ''
    state.firstName = ''
    state.lastName = ''
    state.username = ''
    state.email = ''
    state.roles = []
  },
  [types.WRONG_LOGIN](state, value) {
    state.wrongLogin = value
  },
  [types.MODIFY_SESSION](state, { user }) {
    state.firstName = user.firstName
    state.lastName = user.lastName
  },
}

export const actions = {
  /**
   *
   * @param {*} store
   * @param {{accessToken?: string, user}} payload
   * @returns
   */
  authorize({ commit }, payload) {
    if (!payload?.accessToken || !payload?.user)
      return

    commit(types.CREATE_SESSION, payload)
  },
  changeUserValueAfterUpdate({ commit }, value) {
    commit(types.MODIFY_SESSION, value)
  },
  deauthorize({ commit }) {
    commit(types.DELETE_SESSION)
  },
  updateLoginState({ commit }, value) {
    commit(types.WRONG_LOGIN, value)
  },
}
