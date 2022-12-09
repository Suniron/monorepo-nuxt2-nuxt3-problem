export const types = {
  UPDATE_LOGO: 'UPDATE_LOGO',
}

export const state = () => ({
  logo: null,
})

export const getters = {
  logo: state => state.logo,
}

export const mutations = {
  [types.UPDATE_LOGO](state, newLogo) {
    state.logo = newLogo
  },
}

export const actions = {
  updateLogo({ commit }, value) {
    commit(types.UPDATE_LOGO, value)
  },
}
