export const state = () => ({
  pageTitle: 'Xrator',
  isLoading: false
})

export const Types = {
  CHANGE_PAGE_TITLE: 'CHANGE_PAGE_TITLE',
  CHANGE_IS_LOADING: 'CHANGE_IS_LOADING'
}

export const mutations = {
  [Types.CHANGE_PAGE_TITLE](state, title) {
    state.pageTitle = title
  },

  [Types.CHANGE_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading
  }
}

export const actions = {
  changePageTitle({ commit }, title) {
    document.title = 'xrator - ' + title.toLowerCase()
    commit(Types.CHANGE_PAGE_TITLE, title)
  },
  changeIsLoading({ commit }, isLoading) {
    commit(Types.CHANGE_IS_LOADING, isLoading)
  }
}
