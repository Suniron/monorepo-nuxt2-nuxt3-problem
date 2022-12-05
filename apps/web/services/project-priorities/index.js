// @ts-check

/**
 * Return all available priorities for remediation projects.
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @returns {Promise<import("~/types/project").ProjectPriority[]>}
 */
export const searchProjectPrioritiesService = async (axios) => {
  const {
    data: { data }
  } = await axios.get('/projects/priorities/')

  return data
}
