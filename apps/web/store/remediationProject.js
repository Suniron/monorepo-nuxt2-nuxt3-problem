// @ts-check
/**
 * @typedef {import("~/types/remediationProject").RemediationProjectSummary} RemediationProjectSummary
 * @typedef {import("~/types/store/remediationProject/remediationProjectState").RemediationProjectState} RemediationProjectState
 * @typedef {import('~/types/remediationProject').SpecificRemediationProject} SpecificRemediationProject
 * @typedef {import('~/types/remediationProject').RemediationProjectScopeItem} RemediationProjectScopeItem
 * @typedef {import('~/types/store/remediationProject/remediationProjectStoreContext').RemediationProjectStoreContext} RemediationProjectStoreContext
 */

import {
  searchRemediationProjectPostsService,
  searchRemediationProjectScopeService,
  getRemediationProjectsSummaryService,
  searchRemediationProjectStatusHistoryService,
  searchSpecificRemediationProjectService
} from '~/services/remediation-projects'

export const types = {
  UPDATE_REMEDIATION_PROJECT_DETAILS_INFO:
    'UPDATE_REMEDIATION_PROJECT_DETAILS_INFO',
  UPDATE_REMEDIATION_PROJECT_DETAILS_SCOPE:
    'UPDATE_REMEDIATION_PROJECT_DETAILS_SCOPE',
  UPDATE_REMEDIATION_PROJECT_DETAILS_POSTS:
    'UPDATE_REMEDIATION_PROJECT_DETAILS_POSTS',
  UPDATE_REMEDIATION_PROJECT_DETAILS_STATUS_HISTORY:
    'UPDATE_REMEDIATION_PROJECT_DETAILS_STATUS_HISTORY',
  UPDATE_REMEDIATION_PROJECT_LIST: ' UPDATE_REMEDIATION_PROJECT_LIST'
}

// == STATE ==
/**
 * @returns {RemediationProjectState}
 */
export const state = () => ({
  projectDetails: { info: null, scope: null, posts: null, statusHistory: null },
  remediationProjectIdPrefix: 'PATCH-',
  remediationProjects: []
})

// == GETTERS ==
export const getters = {
  /**
   * Returns the number of different vulnerabilities for the specific project (remove duplicates)
   * @param {RemediationProjectState} state
   * @returns {number} Vulnerabilitys count
   */
  getProjectDetailsVulnerabilityCount: (state) => {
    if (!state.projectDetails.scope) {
      return 0
    }

    return [
      ...new Set(state.projectDetails.scope.map((c) => c.vulnerability_id))
    ].length
  },

  /**
   * Returns the number of different assets for the project (remove duplicates)
   * @param {RemediationProjectState} state
   * @returns {number} Assets count
   */
  getProjectDetailsAssetCount: (state) => {
    if (!state.projectDetails.scope) {
      return 0
    }

    return [...new Set(state.projectDetails.scope.map((c) => c.asset_id))]
      .length
  },

  /**
   * @param {RemediationProjectState} state
   * @returns {import('~/types/remediationProject').RemediationProjectStatusHistory[]} Messages sorted recent to older
   */
  getProjectDetailsStatusHistorySortedByDate: (state) => {
    if (!state.projectDetails?.statusHistory) {
      return []
    }

    return [...state.projectDetails.statusHistory].sort(
      (a, b) =>
        new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
    )
  },
  /**
   * Return **true** if connected user is the owner of selected remediation project
   * @param {RemediationProjectState} state
   * @param {import('~/types/store/state').State} rootState
   * @returns {boolean}
   */
  isUserOwner(state, _getters, rootState) {
    return rootState?.user?.id === state.projectDetails?.info?.owner_id
  },
  /**
   * Return **true** if connected user is an assignee of selected remediation project
   * @param {RemediationProjectState} state
   * @param {import('~/types/store/state').State} rootState
   * @returns {boolean}
   */
  isUserAssignee(state, _getters, rootState) {
    const assigneeIds = state.projectDetails?.info?.assignees.map(
      (assignee) => assignee?.user_id
    )

    if (!assigneeIds) {
      return false
    }

    return assigneeIds.includes(rootState?.user?.id)
  },
  /**
   * Return **true** if connected user is a collaborator (owner or assignee) of selected remediation project
   * @param {any} getters
   * @returns {boolean}
   */
  isReadOnlyMode(_state, getters) {
    return !getters.isUserOwner && !getters.isUserAssignee
  }
}

// == MUTATIONS ==
export const mutations = {
  /**
   * Update the specific remediation project infos
   * @param {RemediationProjectState} state
   * @param {{remediationProjectId: number, newRemediationProjectDetailsInfo: SpecificRemediationProject}} payload
   */
  [types.UPDATE_REMEDIATION_PROJECT_DETAILS_INFO](
    state,
    { newRemediationProjectDetailsInfo }
  ) {
    state.projectDetails.info = newRemediationProjectDetailsInfo
  },
  /**
   * Update the specific remediation project scope
   * @param {RemediationProjectState} state
   * @param {{remediationProjectId: number, newRemediationProjectDetailsScope: RemediationProjectScopeItem[]}} payload
   */
  [types.UPDATE_REMEDIATION_PROJECT_DETAILS_SCOPE](
    state,
    { newRemediationProjectDetailsScope }
  ) {
    state.projectDetails.scope = newRemediationProjectDetailsScope.sort(
      (a, b) => a.project_scope_id - b.project_scope_id
    )
  },
  /**
   * Update the specific remediation project posts
   * @param {RemediationProjectState} state
   * @param {{remediationProjectId: number, newRemediationProjectDetailsPosts: import('~/types/remediationProject').RemediationProjectPost[]}} payload
   */
  [types.UPDATE_REMEDIATION_PROJECT_DETAILS_POSTS](
    state,
    { newRemediationProjectDetailsPosts }
  ) {
    state.projectDetails.posts = newRemediationProjectDetailsPosts
  },
  /**
   * Update the specific remediation project status history
   * @param {RemediationProjectState} state
   * @param {{remediationProjectId: number, newRemediationProjectDetailsStatusHistory: import('~/types/remediationProject').RemediationProjectStatusHistory[]}} payload
   */
  [types.UPDATE_REMEDIATION_PROJECT_DETAILS_STATUS_HISTORY](
    state,
    { newRemediationProjectDetailsStatusHistory }
  ) {
    state.projectDetails.statusHistory = newRemediationProjectDetailsStatusHistory
  },
  /**
   * Update the current remediation project list
   * @param {RemediationProjectState} state
   * @param {RemediationProjectSummary[]} remediationProjectList
   */
  [types.UPDATE_REMEDIATION_PROJECT_LIST](state, remediationProjectList) {
    state.remediationProjects = remediationProjectList
  }
}

// == ACTIONS ==
export const actions = {
  /**
   *
   * @param {RemediationProjectStoreContext} context
   * @param {number} remediationProjectId
   */
  async fetchRemediationProjectDetails({ dispatch }, remediationProjectId) {
    await Promise.all([
      dispatch('fetchRemediationProjectDetailsInfo', remediationProjectId),
      dispatch('fetchRemediationProjectDetailsScope', remediationProjectId),
      dispatch('fetchRemediationProjectDetailsPosts', remediationProjectId),
      dispatch(
        'fetchRemediationProjectDetailsStatusHistory',
        remediationProjectId
      )
    ])
  },
  /**
   * @param {RemediationProjectStoreContext} context
   * @param {number} remediationProjectId
   */
  async fetchRemediationProjectDetailsInfo({ commit }, remediationProjectId) {
    try {
      const newRemediationProjectDetailsInfo = await searchSpecificRemediationProjectService(
        this.$axios,
        remediationProjectId
      )
      // Update state by committing the mutation
      commit(types.UPDATE_REMEDIATION_PROJECT_DETAILS_INFO, {
        remediationProjectId,
        newRemediationProjectDetailsInfo
      })

      return newRemediationProjectDetailsInfo
    } catch (error) {
      // TODO: handle request error
    }
  },
  /**
   *
   * @param {RemediationProjectStoreContext} context
   * @param {number} remediationProjectId
   */
  async fetchRemediationProjectDetailsScope({ commit }, remediationProjectId) {
    try {
      const newRemediationProjectDetailsScope = await searchRemediationProjectScopeService(
        this.$axios,
        remediationProjectId
      )

      // Update state by committing the mutation
      commit(types.UPDATE_REMEDIATION_PROJECT_DETAILS_SCOPE, {
        remediationProjectId,
        newRemediationProjectDetailsScope
      })

      return newRemediationProjectDetailsScope
    } catch (error) {
      // TODO: handle request error
    }
  },
  /**
   *
   * @param {RemediationProjectStoreContext} context
   * @param {number} remediationProjectId
   */
  async fetchRemediationProjectDetailsPosts({ commit }, remediationProjectId) {
    try {
      const newRemediationProjectDetailsPosts = await searchRemediationProjectPostsService(
        this.$axios,
        remediationProjectId
      )

      // Update state by committing the mutation
      commit(types.UPDATE_REMEDIATION_PROJECT_DETAILS_POSTS, {
        remediationProjectId,
        newRemediationProjectDetailsPosts
      })
      return newRemediationProjectDetailsPosts
    } catch (error) {
      // TODO: handle request error
    }
  },
  /**
   *
   * @param {RemediationProjectStoreContext} context
   * @param {number} remediationProjectId
   */
  async fetchRemediationProjectDetailsStatusHistory(
    { commit },
    remediationProjectId
  ) {
    try {
      const newRemediationProjectDetailsStatusHistory = await searchRemediationProjectStatusHistoryService(
        this.$axios,
        remediationProjectId
      )

      // Update state by committing the mutation
      commit(types.UPDATE_REMEDIATION_PROJECT_DETAILS_STATUS_HISTORY, {
        remediationProjectId,
        newRemediationProjectDetailsStatusHistory
      })

      return newRemediationProjectDetailsStatusHistory
    } catch (error) {
      // TODO: handle request error
    }
  },
  /**
   * @param {RemediationProjectStoreContext} context
   */
  async fetchRemediationProjectList({ commit }) {
    let remediationProjectList
    try {
      const result = await getRemediationProjectsSummaryService(this.$axios)
      remediationProjectList = result.remediationProjects
    } catch (error) {
      throw new Error(error)
    }
    commit(types.UPDATE_REMEDIATION_PROJECT_LIST, remediationProjectList)
    return remediationProjectList
  }
}
