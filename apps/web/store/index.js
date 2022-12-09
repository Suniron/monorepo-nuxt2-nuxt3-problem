export const state = () => ({
  isLoading: false,
  pageTitle: 'Xrator',
})

export const Types = {
  CHANGE_IS_LOADING: 'CHANGE_IS_LOADING',
  CHANGE_PAGE_TITLE: 'CHANGE_PAGE_TITLE',
}

export const mutations = {
  [Types.CHANGE_PAGE_TITLE](state, title) {
    state.pageTitle = title
  },

  [Types.CHANGE_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  changeIsLoading({ commit }, isLoading) {
    commit(Types.CHANGE_IS_LOADING, isLoading)
  },
  changePageTitle({ commit }, title) {
    document.title = `xrator - ${title.toLowerCase()}`
    commit(Types.CHANGE_PAGE_TITLE, title)
  },
}
