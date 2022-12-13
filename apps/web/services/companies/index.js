// @ts-check

/**
 * Get logo of user company in base64 format
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @returns {Promise<string>} base64 encoded image
 */
export const getCompanyLogo = async (axios) => {
  const { data } = await axios.get('/company/logo')
  return data.logo
}

/**
 * Set logo of user company
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @param {string} base64Image base64 encoded image
 */
export const setCompanyLogo = async (axios, base64Image) => {
  const result = await axios.patch('/company/logo', { logo: base64Image })

  if (![200, 204].includes(result.status))
    throw new Error('Error while setting company logo')
}

/**
 * Set logo of user company
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @param {string} body
 */

export const updateCompanyInformations = async (axios, body) => {
  const result = await axios.patch('/company', body)
  return result
}
/**
 * Remove logo of user company
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 */
export const removeCompanyLogo = async (axios) => {
  await axios.delete('/company/logo')
}

/**
 * Get risk of user company
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @returns {Promise<{globalScore:number | null}>} risk of the company
 */
export const getCompanyRisk = async (axios) => {
  const { data } = await axios.get('/company/risk')
  return data
}
