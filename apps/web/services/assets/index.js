let store = null

window.onNuxtReady((app) => {
  store = app.$nuxt.$store
})

const getEndpoint = id => (id ? `/assets/${id}` : '/assets')
const getVulnerabilitiesEndpoint = id => `${getEndpoint(id)}/vulnerabilities`
const getRevisionsEndpoint = id => `${getEndpoint(id)}/revisions`
const getImportCsvEndpoit = () => `${getEndpoint()}/importCSV`

/**
 * Search and returns assets
 *
 * @param {NuxtAxiosInstance} axios Axios instance to use
 * @param {object} params Params for search
 * @param {number=} params.page Page number
 * @param {number=} params.pageSize Page size
 * @param {string=} params.search Search text to search assets by name
 * @param {number[] | string=} params.ids Array of tag IDs or string of IDs separated by commas to filter assets by tags
 * @param {number[]=} params.tagIds Array of tag IDs to filter assets by tags
 * @param {number[]=} params.groupIds Array of group IDs to filter assets by groups
 * @param {string[]=} params.severities Array of vulnerability severities to filter assets that
 *                                     contain vulnerabilities of such severities
 * @param {string[]=} params.types Array of asset type to filter asset that are of such type
 * @returns {Promise<{ assets: import('~/types/asset').Asset[], total: number }>} Assets from search result
 */
export const searchAssetsService = async (axios, params) => {
  const {
    ids,
    search,
    tagIds,
    groupIds,
    severities,
    types,
    attribute,
    page,
    pageSize,
  } = params

  const queryParams = {
    attribute,
    groupIds:
      Array.isArray(groupIds) && groupIds.length
        ? groupIds.join(',')
        : undefined,
    ids: Array.isArray(ids) ? ids.join(',') : ids,
    page,
    pageSize,
    search,
    severities:
      Array.isArray(severities) && severities.length
        ? severities.join(',')
        : undefined,
    tagIds:
      Array.isArray(tagIds) && tagIds.length ? tagIds.join(',') : undefined,
    types: Array.isArray(types) && types.length ? types.join(',') : undefined,
  }

  const { data } = await axios.get(getEndpoint(), {
    params: queryParams,
  })
  return data
}

export const searchAssetByIdService = async (axios, id) => {
  const { data } = await axios.get(getEndpoint(id))
  return data
}

export const createAssetService = async (axios, params) => {
  const bodyPayload = {
    assetData: params.assetData,
    name: params.name,
    type: params.type,
  }

  const data = (await axios.post(getEndpoint(), bodyPayload)).data

  await store.dispatch('assets/updateAssetSummary', axios)

  return data
}

export const deleteAssetService = async (axios, id) => {
  if (!id)
    throw new Error('Param "id" needed to delete asset')

  await axios.delete(getEndpoint(id))

  await store.dispatch('assets/updateAssetSummary', axios)
}

export const updateAssetService = (axios, id, params) => {
  if (!id)
    throw new Error('Param "id" needed to update asset')

  const bodyPayload = {
    assetData: params.assetData,
    groupIds: params.groupIds,
    name: params.name,
    tagIds: params.tagIds,
    type: params.type,
    x: params.x,
    y: params.y,
  }

  if (Object.values(bodyPayload).some(param => param !== undefined))
    return axios.patch(getEndpoint(id), bodyPayload)
}

export const updateAssetsBulkService = async (axios, params) => {
  const bodyPayload = {
    assetData: params.assetData,
    assets: params.assets,
    groupIds: params.groupIds,
    name: params.name,
    tagIds: params.tagIds,
    type: params.type,
  }

  const { data } = await axios.patch(getEndpoint(), bodyPayload)
  return data
}

export const createAssetVulnerability = async (axios, assetId, params) => {
  await axios.patch(`/assets/${assetId}/vulnerabilities`, params)
}
export const updateSpecialPortInAssetVulnerabilities = async (axios, form) => {
  const bodyPayload = {
    vuln: form,
  }
  const response = await axios.patch(
    `/assets/vulnerabilities_asset/${bodyPayload.vuln.vast_id}`,
    bodyPayload,
  )
  return response
}

export const deleteAssetVulnerabilities = async (axios, item) => {
  const bodyPayload = {
    vuln: item,
  }
  await axios.delete(
    `/assets/vulnerabilities_asset/${bodyPayload.vuln.vast_id}`,
    bodyPayload,
  )
}

export const deleteAssetsBulkService = async (axios, params) => {
  const bodyPayload = {
    assets: params.assets,
  }

  await axios.delete(getEndpoint(), { data: bodyPayload })

  await store.dispatch('assets/updateAssetSummary', axios)
}

export const searchAssetVulnerabilities = async (axios, id, params) => {
  if (!id) {
    throw new Error(
      'Param "id" needed to search the vulnerabilities of an asset',
    )
  }

  const queryParams = {
    search: params.search || undefined,
    severities:
      Array.isArray(params.severities) && params.severities.length
        ? params.severities.join(',')
        : undefined,
    type: params.type || undefined,
  }
  const { data } = await axios.get(getVulnerabilitiesEndpoint(id), {
    params: queryParams,
  })

  return data
}

export const searchAssetRevisions = async (axios, id, params) => {
  if (!id) {
    throw new Error(
      'Param "id" needed to search the vulnerabilities of an asset',
    )
  }
  const queryParams = {
    search: params.search || undefined,
  }
  const { data } = await axios.get(getRevisionsEndpoint(id), {
    params: queryParams,
  })
  return data
}

export const importCsvService = async (axios, params) => {
  const { data } = await axios.post(getImportCsvEndpoit(), params)
  return data
}

export const fetchAssetsPortsService = async (axios, assetId) => {
  const { data } = await axios.get(`/assets/${assetId}/ports`)
  return data.details
}

export const tmpService = async (axios, q) => {
  await axios.post('/scans/tmp', q)
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {{ childrenIds?: number[] | number, parentsIds?: number[] | number }} [options]
 * @return {Promise<{data: {assets: import('~/types/asset').AssetWithRelations[] }}>}
 */
export const searchAssetsBelonging = async (axios, options) => {
  const params = {
    children_ids: options?.childrenIds,
    parents_ids: options?.parentsIds,
  }
  const result = await axios.get('/assets/belonging', { params })

  result.data.assets = result.data.assets.map((asset) => {
    const newObject = {
      ...asset,
      childrenIds: asset.children_ids,
      parentsIds: asset.parents_ids,
    }

    delete newObject.children_ids
    delete newObject.parents_ids

    return newObject
  })

  return result
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} assetId
 * @return {Promise<{data: {lastScanDate: string, scores: {inherentScore: number | null, inheritedScore: number | null, compoundScore: number | null}, hasVulnerability: boolean}}>}
 */
export const getAssetsRisk = async (axios, assetId) => {
  const result = await axios.get(`/assets/${assetId}/risk`)
  return result
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} assetId
 * @return {Promise<{data: {
 *  USER?: number;
 *  SERVER?: number;
 *  WEB?: number;
 *  BUILDING?: number;
 *  NETWORK?: number;
 *  UNIT?: number;
 *  MISSION?: number;
 *  USERGROUP?: number;
 *  POLICY?: number;
 *  COMPLIANCE?: number;
 *  PROCEDURE?: number;
 *  superAssets: number;
 *  technicalAssets: number;
 * }}>}
 */
export const getAssetSummary = async (axios) => {
  const result = await axios.get('/assets/summary')
  return result
}
