import { createAPIError } from '@/common/errors/api'

/**
 * Parameters used for fetching dashboard charts data
 *
 * @typedef {object} ChartParams
 * @property {number} companyId Company ID from which to obtain charts data
 * @property {string} [cid] Chart ID. Used in this model to identify which chart to fetch data from
 * @property {string} [charts] Comma-separated string-array of chart IDs. Used when requesting multiple
 *                             specific charts. If not given, it will fetch all dashboard charts
 * @property {string} [top] Number of top N vulnerabilities to return
 */

/**
 * Request from store API dashboard charts data
 *
 * @param {object} provider Axios and logger
 * @param {ChartParams} params Chart search params
 * @returns {Promise<object>}
 */
export const requestChartsData = async (provider, params, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const { cid } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    if (cid) {
      return (
        await axios.get(`/dashboard/${cid}`, {
          ...reqConfig,
          params: {
            ...params,
            cid: undefined, // alr sent as URL param
          },
        })
      ).data
    }

    return (await axios.get('/dashboard', { ...reqConfig, params })).data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestFetchDashboard = async (provider, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/dashview', reqConfig)
    return data.dashboard
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateDashboardUser = async (
  provider,
  id,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.post(`/dashview/${id}`, params, reqConfig)
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
