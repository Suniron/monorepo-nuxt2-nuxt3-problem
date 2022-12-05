// @ts-check
/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @returns {Promise<import('@/types/businessImpactAnalysis').Severity[]>} severities
 */
export const searchBusinessImpactSeverities = async (axios) => {
  const { data } = await axios.get('/severities/')
  return data
}
