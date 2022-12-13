// @ts-check
/**
 * @typedef {import("@nuxtjs/axios").NuxtAxiosInstance} Axios
 */

/**
 *
 * @param {Axios} axios
 * @param {number} id
 * @returns {Promise<import("~/types/businessImpactAnalysis").BusinessMissionAnalysis>}
 */
export const searchMissionAnalysis = async (axios, id) => {
  const { data } = await axios.get(`/missions_analysis/${id}`)
  return data
}

/**
 * This function is used to update the list of Business Impact attached to a Business Unit.
 *
 * @param {Axios} axios
 * @param {Number} fearedEventId Id of the Business Unit Feared Event
 * @param {Number[]} businessImpactIds Array of Business Impact Ids
 */
export const updateBusinessImpactsLinkedToMissionUnit = async (
  axios,
  fearedEventId,
  businessImpactIds,
) => {
  const { data } = await axios.patch(
    `/missions_analysis/${fearedEventId}/business_impact`,
    businessImpactIds,
  )
  return data
}

export const fetchBusinessImpactList = async (axios) => {
  const { data } = await axios.get('/business_impact')
  return data
}
