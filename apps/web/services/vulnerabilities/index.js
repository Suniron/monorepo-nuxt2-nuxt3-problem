const getEndpoint = id => (id ? `/vulnerabilities/${id}` : '/vulnerabilities')

/**
 * Search and returns vulnerabilities
 *
 * @param {Axios} axios Axios instance to use
 * @param {object} params Params for search
 * @param {string} params.search Search text to search assets by name
 * @returns {Promise<{ vulnerabilities: object[], total: number }>} Vulnerabilities from search result
 */
export const searchVulnerabilitiesService = async (axios, params) => {
  const { data } = await axios.get(getEndpoint(), { params })
  return data
}

/**
 * Search and returns vulnerabilities
 *
 * @param {Axios} axios Axios instance to use
 * @param {object} params Params for search
 * @param {string} params.search Search text to search assets by name
 * @param {number[]} params.severities The severity of the vulnerability to search for
 * @param {number[]} params.likelihoods The likelihoods of the vulnerability to search for
 * @param {number[]} params.assetsIds The IDs of the assets to search for
 * @param {number[]} params.clustersIds The IDs of the clusters to search for
 * @param {number} params.page The page number to get
 * @param {number} params.pageSize The number of result to get
 * @returns {Promise<{ vulnerabilities: import("~/types/vulnerability").VulnerabilityWithAssets[], total: number }>} Vulnerabilities from search result
 */
export const searchVulnerabilitiesWithTheirAssetsService = async (
  axios,
  params = {},
) => {
  const formattedParams = {
    assets_ids: params.assetsIds?.join(','),
    clusters_ids: params.clustersIds?.join(','),
    likelihoods: params.likelihoods,
    page: params.page,
    page_size: params.pageSize,
    search: params.search,
    severities: params.severities,
  }
  const result = await axios.get(`${getEndpoint()}/assets`, {
    params: formattedParams,
  })

  result.data.vulnerabilities.forEach((vulnerability) => {
    vulnerability.clusterId = vulnerability.cluster_id
    delete vulnerability.cluster_id
  })

  return result.data
}

export const searchVulnerabilityByIdService = async (axios, id) => {
  const { data } = await axios.get(getEndpoint(id))
  return data
}

export const searchVulnerabilityByIdWithItsAssetsService = async (
  axios,
  id,
) => {
  const { data } = await axios.get(`${getEndpoint(id)}/assets`)
  return data
}

export const createVulnerabilityService = async (axios, params) => {
  const { data } = await axios.post(getEndpoint(), params)
  return data
}
