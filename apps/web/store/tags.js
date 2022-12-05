import _debounce from 'lodash/debounce'

// Services
import { searchTagsService, createTagService } from '~/services/tags'

const DEBOUNCE_TIME = 300

export const TYPES = {
  SET_TAGS: 'SET_TAGS'
}

export const state = () => ({
  tags: []
})

export const getters = {}

export const mutations = {
  [TYPES.SET_TAGS](state, tags) {
    state.tags = [...tags]
  }
}

export const actions = {
  fetchTags: _debounce(async function({ commit }) {
    try {
      const { tags } = await searchTagsService(this.$axios)
      commit(TYPES.SET_TAGS, tags)
    } catch (error) {
      console.error(error)
    }
  }, DEBOUNCE_TIME),
  async createTag({ dispatch }, { name, color }) {
    try {
      await createTagService(this.$axios, { name, color })
      await dispatch('fetchTags')
    } catch (error) {
      console.error(error)
      return { error }
    }
  }
}
