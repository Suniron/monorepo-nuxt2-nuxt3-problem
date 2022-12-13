// @ts-check

/**
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @returns {Promise<{total: number, remediationProjects: import("~/store/remediationProject").RemediationProjectSummary[]}>}
 */
export const getRemediationProjectsSummaryService = async (axios) => {
  const { data } = await axios.get('/remediation-projects/summary')
  return data
}

/**
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @param {{
 *  name: string,
 *  description: string,
 *  owner: string,
 *  priority: number,
 *  due_date: string,
 *  start_date: string,
 *  assignees: string[],
 *  project_scope: number[]
 * }} params
 * @returns {Promise<number>}
 */
export const createRemediationProjectService = async (axios, params) => {
  const { data } = await axios.post('/remediation-projects/', params)
  return data.id
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} remediationProjectId
 * @returns {Promise<import('~/types/remediationProject').SpecificRemediationProject>}
 */
export const searchSpecificRemediationProjectService = async (
  axios,
  remediationProjectId,
) => {
  const { data } = await axios.get(
    `/remediation-projects/${remediationProjectId}`,
  )

  if (data.error)
    throw new Error(data.error?.message)

  return data
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} remediationProjectId
 * @returns {Promise<import('~/types/remediationProject').RemediationProjectScopeItem[]>}
 */
export const searchRemediationProjectScopeService = async (
  axios,
  remediationProjectId,
) => {
  const { data } = await axios.get(
    `/remediation-projects/${remediationProjectId}/scope`,
  )

  if (data.error)
    throw new Error(data.error?.message)

  return data
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} fromStatusId
 * @returns {Promise<import('~/types/remediationProject').StatusTransition[]>}
 */
export const searchAvailableTransitionsFromStatusIdService = async (
  axios,
  fromStatusId,
) => {
  const { data } = await axios.get(
    `/projects/available-transitions/${fromStatusId}`,
  )
  return data
}

/**
 *
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} projectId
 * @returns {Promise<import('~/types/remediationProject').RemediationProjectStatusHistory[]>}
 */
export const searchRemediationProjectStatusHistoryService = async (
  axios,
  projectId,
) => {
  const { data } = await axios.get(
    `/remediation-projects/${projectId}/status-history`,
  )

  if (data.error)
    throw new Error(data.error?.message)

  return data
}

/**
 *
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} remediationProjectId
 * @returns {Promise<import('~/types/remediationProject').RemediationProjectPost[]>}
 */
export const searchRemediationProjectPostsService = async (
  axios,
  remediationProjectId,
) => {
  const { data } = await axios.get(
    `/posts/remediation-project/${remediationProjectId}`,
  )

  if (data.error)
    throw new Error(data.error?.message)

  return data
}

/**
 * Replace all scope (keep not deleted existing scope items)
 *
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} projectId
 * @param {{project_scope: number[]}} payload all vulnerability_asset_ids which compose the scope
 * @returns {Promise<void>}
 */
export const updateRemediationProjectScopeService = async (
  axios,
  projectId,
  payload,
) => {
  await axios.patch(`/remediation-projects/${projectId}/scope/`, payload)
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} projectId
 * @param {import('~/types/remediationProject').RemediationProjectScopeItem} remediationProjectScopeItem Updated remediation project scope couple
 * @returns {Promise<void>}
 */
export const updateRemediationProjectScopeItemService = async (
  axios,
  projectId,
  remediationProjectScopeItem,
) => {
  await axios.patch(
    `/remediation-projects/${projectId}/scope/${remediationProjectScopeItem.project_scope_id}`,
    {
      is_done: remediationProjectScopeItem.is_done,
    },
  )
}

/**
 * Update a specific remediation project
 *
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} remediationProjectId
 * @param {{project_name?: string, project_description?: string, status_id?: number, due_date?: string, assignees?: string[], priority_id?: number, owner_id?: string}} infoToUpdate note: project_scope is a list of **vulnerability_asset_id** here
 * @returns {Promise<{status: string, data: {status_history_id?: number}}>}
 */
export const updateRemediationProjectService = async (
  axios,
  remediationProjectId,
  infoToUpdate,
) => {
  const { data } = await axios.patch(
    `/remediation-projects/${remediationProjectId}`,
    infoToUpdate,
  )

  return data
}

/**
 * Create a new comment of the remediation project.
 *
 * Note: User id (of author) will be get from auth
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} projectId
 * @param {{comment: string, projectStatusHistoryId?: number}} post
 */
export const createRemediationProjectPostService = async (
  axios,
  projectId,
  post,
) => {
  await axios.post(`/posts/remediation-project/${projectId}`, {
    comment: post.comment,
    remediation_project_status_history_id: post.projectStatusHistoryId,
  })
}

/**
 * @param {import("../businessMissionAnalysis").Axios} axios
 * @returns {Promise<{data: {
 *  clusterId: number,
 *  remediation: string,
 *  count_vuln: number,
 *  count_asset: number,
 *  count_asset_vuln: number,
 *  count_asset_vuln_unmanaged: number,
 * }[]}>}
 */
export const searchGroupedRemediationsService = async (axios) => {
  /**
   * @type {{data: {data: {
   *  cluster_id?: number,
   *  clusterId: number,
   *  remediation: string,
   *  count_vuln: number,
   *  count_asset: number,
   *  count_asset_vuln: number,
   *  count_asset_vuln_unmanaged: number,
   * }[]}}}
   */
  const { data } = await axios.get('/remediations/grouped')

  data.data.forEach((remediation) => {
    remediation.clusterId = remediation.cluster_id
    delete remediation.cluster_id
  })

  return { data: data.data }
}
