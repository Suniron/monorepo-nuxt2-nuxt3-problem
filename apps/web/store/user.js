export const types = {
  CREATE_SESSION: 'CREATE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  WRONG_LOGIN: 'WRONG_LOGIN',
  MODIFY_SESSION: 'MODIFY_SESSION'
}

export const state = () => ({
  accessToken: '',
  id: '',
  firstName: '',
  lastName: '',
  wrongLogin: false,
  username: '',
  email: '',
  roles: []
})

export const getters = {
  isLoggedIn: (state) => !!(state.accessToken && state.id),
  id: (state) => state.id,
  firstName: (state) => state.firstName,
  lastName: (state) => state.lastName,
  wrongLogin: (state) => state.wrongLogin,
  username: (state) => state.username,
  email: (state) => state.email,
  roles: (state) => state.roles,
  isAdmin: (state) => state.roles.includes('admin')
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
  }
}

export const actions = {
  /**
   *
   * @param {*} store
   * @param {{accessToken?: string, user}} payload
   * @returns
   */
  authorize({ commit }, payload) {
    if (!payload?.accessToken || !payload?.user) {
      return
    }

    commit(types.CREATE_SESSION, payload)
  },
  deauthorize({ commit }) {
    commit(types.DELETE_SESSION)
  },
  updateLoginState({ commit }, value) {
    commit(types.WRONG_LOGIN, value)
  },
  changeUserValueAfterUpdate({ commit }, value) {
    commit(types.MODIFY_SESSION, value)
  }
}
