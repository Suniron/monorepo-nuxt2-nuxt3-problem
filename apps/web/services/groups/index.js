const getEndpoint = id => (id ? `/groups/${id}` : '/groups')

/**
 * @typedef Group
 * @property {number} id ID of the group
 * @property {string} name Name of the group
 */

/**
 * Search for all the groups of the company
 *
 * @param {Axios} axios Axios instance to use
 * @param {object} params Params to perform search
 * @returns {Promise<{ groups: Group[], total: number }>} Groups of the company
 */
export const searchGroupsService = async (axios, params) => {
  const queryParams = {}
  const { data } = await axios.get(getEndpoint(), { params: queryParams })
  return data
}

/**
 * Returns a group object by id. Throws a 404 error if group not found.
 *
 * @param {Axios} axios Axios instance to use
 * @param {number} id ID of a group
 * @returns {Group} Group object
 */
export const searchGroupByIdService = async (axios, id) => {
  const { data } = await axios.get(getEndpoint(id))
  return data
}

/**
 * @param {Axios} axios
 * @param {{
 *  name: string,
 *  memberIds: string[]
 * }} params
 * @returns
 */
export const createGroupService = async (axios, params) => {
  const { name, memberIds } = params

  if (!name)
    throw new Error('Param "name" required to create group')

  if (!Array.isArray(memberIds))
    throw new TypeError('Param "memberIds" must be an array')

  const bodyPayload = {
    memberIds,
    name,
  }

  const { data } = await axios.post(getEndpoint(), bodyPayload)
  return data
}

/**
 * @param {Axios} axios
 * @param {Number} groupId
 * @param {{
 *  name: string,
 *  memberIds: string[]
 * }} params
 * @returns
 */
export const updateGroupService = async (axios, groupId, params) => {
  if (!groupId)
    throw new Error('Param "id" required to update group')

  const { name, memberIds } = params

  if (!name && !memberIds)
    throw new Error('Nothing to update from group')

  if (!Array.isArray(memberIds))
    throw new TypeError('Param "memberIds" must be an array')

  const bodyPayload = {
    memberIds,
    name: name || undefined,
  }

  const { data } = await axios.patch(getEndpoint(groupId), bodyPayload)
  return data
}

export const deleteGroupService = async (axios, params = {}) => {
  const { id } = params
  const data = await axios.delete(getEndpoint(id))
  return data
}
