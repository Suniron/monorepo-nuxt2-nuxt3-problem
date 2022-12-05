const getEndpoint = (id) => (id ? '/tags/' + id : '/tags')

/**
 * @typedef Tag
 * @property {number} id ID of the tag
 * @property {string} name Name of the tag
 * @property {string} color Color of tag in hexadecimal format. i.e. #ff0000
 */

/**
 * Search for all tags for assets
 *
 * @param {Axios} axios Axios instance to use
 * @param {object} params Params to perform search
 * @returns {Promise<{ tags: Tag[], total: number }>} Tags available
 */
export const searchTagsService = async (axios, params) => {
  const queryParams = {}

  const { data } = await axios.get(getEndpoint(), { params: queryParams })
  return data
}

/**
 * Returns a tag object by id. Throws a 404 error if tag not found.
 *
 * @param {Axios} axios Axios instance to use
 * @param {number} id ID of a tag
 * @returns {Tag} Tag object
 */
export const searchTagByIdService = async (axios, id) => {
  const { data } = await axios.get(getEndpoint(id))
  return data
}

/**
 * Creates a tag and returns its ID
 *
 * @param {Axios} axios Axios instance to use
 * @param {{ name: string, color: string }} params Params to create
 * @returns {Promise<string>} ID of created tag
 */
export const createTagService = async (axios, params) => {
  const { name, color } = params
  if (!name) throw new Error('Param "name" required to create tag')

  const bodyPayload = { name, color }
  const { data } = await axios.post(getEndpoint(), bodyPayload)
  return data.id
}

/**
 * Deletes a tag given an ID
 *
 * @param {Axios} axios Axios instance to use
 * @param {string} id ID of tag to delete
 * @returns {Promise<void>} Resolved promise if successful. Rejected promise if not.
 */
export const patchTagService = async (axios, id, tagData) => {
  if (!id) throw new Error('Param "id" required to delete tag')
  const bodyPayload = { name: tagData.name, color: tagData.color }

  await axios.patch(getEndpoint(id), bodyPayload)
}

/**
 * Deletes a tag given an ID
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios Axios instance to use
 * @param {string} id ID of tag to delete
 * @returns {Promise<AxiosResponse<any>>} Resolved promise if successful. Rejected promise if not.
 */
export const deleteTagService = async (axios, id) => {
  if (!id) throw new Error('Param "id" required to delete tag')

  return await axios.delete(getEndpoint(id))
}
