import { SUCCESS } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestSearchCompanies = async (
  provider,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const { cid, search } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    if (cid) {
      return {
        company: (await axios.get(`/companies/${cid}`), reqConfig).data,
      }
    }

    const queryParams = { search }
    const {
      data: { companies, total },
    } = await axios.get('/companies', { ...reqConfig, params: queryParams })
    return { companies, total }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateCompany = async (
  provider,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const { name } = params

    const bodyParams = { name }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const {
      data: { id },
    } = await axios.post('/companies', bodyParams, reqConfig)

    return { id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

/**
 *
 * @param {{axios: import('axios').AxiosInstance, logger: Console}} provider
 * @param {{}} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string, logo?: string}>}
 */
export const requestSearchCompanyLogo = async (
  provider,
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
    const {
      data: { logo },
    } = await axios.get('/company/logo', { ...reqConfig })
    return { logo }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

/**
 *
 * @param {{axios: import('axios').AxiosInstance, logger: Console}} provider
 * @param {{logo: string}} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string , status?: string}>}
 */
export const requestUpdateCompanyLogo = async (
  provider,
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
    await axios.patch('/company/logo', params, reqConfig)
    return { status: SUCCESS }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

/**
 *
 * @param {{axios: import('axios').AxiosInstance, logger: Console}} provider
 * @param {{}} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string , status?: string}>}
 */
export const requestDeleteCompanyLogo = async (
  provider,
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
    await axios.delete('/company/logo', reqConfig)
    return { status: SUCCESS }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateCompany = async (
  provider,
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
    await axios.patch('/company', params, reqConfig)
    return { status: SUCCESS }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetCompanyRisk = async (provider, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/company/risk', { ...reqConfig })
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
