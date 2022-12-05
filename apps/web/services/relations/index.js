// @ts-check

/**
 * @typedef {import("@nuxtjs/axios").NuxtAxiosInstance} Axios
 */

const getEndpoint = (id) => (id ? '/relations/' + id : '/relations')

export const createRelationService = async (axios, params) => {
  const { data } = await axios.post(getEndpoint(), params)
  return data.id
}

/**
 *
 * @param {Axios} axios
 * @param {{fromAssetId: number, relationType: string | null, toAssetId: number}[]} params
 * @returns
 */
export const createBulkRelationService = async (axios, params) => {
  const { data } = await axios.post(`${getEndpoint()}/bulk`, params)
  return data
}

export const updateRelationService = async (axios, id, params) => {
  const { data } = await axios.patch(getEndpoint(id), params)
  return data.id
}

export const deleteRelationService = async (axios, id) => {
  const { data } = await axios.delete(getEndpoint(id))
  return data.status
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {{ fromAssetId: number, relationType: string, toAssetId: number }} params
 * @return {Promise<{ count: number }>}
 */
export const deleteRelationByAssetsIdsService = async (axios, params) => {
  const { fromAssetId, relationType, toAssetId } = params
  /**
   * @type {{ data: { count: number } }}
   */
  const { data } = await axios.delete(
    getEndpoint() + `/${fromAssetId}/${relationType}/${toAssetId}`
  )
  return data
}
