import _debounce from 'lodash/debounce'

// Services
import { searchGroupsService } from '~/services/groups'

const DEBOUNCE_TIME = 300

export const TYPES = {
  SET_GROUPS: 'SET_GROUPS',
  CHANGE_MEMBERS_FROM_GROUP: 'CHANGE_MEMBERS_FROM_GROUP'
}

export const state = () => ({
  groups: []
})

export const getters = {}

export const mutations = {
  [TYPES.SET_GROUPS](state, groups) {
    state.groups = [...groups]
  },
  [TYPES.CHANGE_MEMBERS_FROM_GROUP](state, { groupId, members }) {
    const newGroups = [...state.groups]
    const groupToChange = newGroups.find((group) => group.id === groupId)
    groupToChange.members = [...members]

    state.groups = newGroups
  }
}

export const actions = {
  fetchGroups: _debounce(async function({ commit }) {
    try {
      const { groups } = await searchGroupsService(this.$axios)
      commit(TYPES.SET_GROUPS, groups)
    } catch (error) {
      console.error(error)
    }
  }, DEBOUNCE_TIME),
  changeMembersFromGroup({ state, commit }, { groupId, members }) {
    if (!state.groups.find((group) => group.id === groupId)) return
    commit(TYPES.CHANGE_MEMBERS_FROM_GROUP, { groupId, members })
  }
}
