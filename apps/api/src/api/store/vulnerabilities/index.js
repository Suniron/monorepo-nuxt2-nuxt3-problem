import { createAPIError } from '@/common/errors/api'
import { throwHTTPError } from '@/common/errors'
import { log } from '@/lib/logger'

export const requestSearchVulnerabilities = async (
  provider,
  params,
  accessToken,
) => {
  const { axios } = provider
  try {
    const { vid, search, severities, likelihoods } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    // Vulnerability by id
    if (vid) {
      return {
        vulnerability: (await axios.get(`/vulnerabilities/${vid}`, reqConfig))
          .data,
      }
    }

    // Search vulnerabilities
    const queryParams = { likelihoods, search, severities }
    const { data } = await axios.get('/vulnerabilities', {
      ...reqConfig,
      params: queryParams,
    })
    if (data.error)
      throwHTTPError(data.error)
    return data
  }
  catch (error) {
    log.withError(error).error('requestSearchVulnerabilities')
    return createAPIError(error)
  }
}

export const requestSearchVulnerabilitiesWithTheirAssets = async (
  provider,
  params,
  accessToken,
) => {
  const { axios } = provider
  try {
    const { vid } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    // Vulnerability by id
    if (vid) {
      const result = await axios.get(
        `/vulnerabilities/${vid}/assets`,
        reqConfig,
      )
      return {
        vulnerability: result.data,
      }
    }

    // Search vulnerabilities
    const { data } = await axios.get('/vulnerabilities/assets', {
      ...reqConfig,
      params,
    })
    return data
  }
  catch (error) {
    log.withError(error).error('requestSearchVulnerabilitiesWithTheirAssets')
    return createAPIError(error)
  }
}

export const requestUpdatePortVuln = async (
  provider,
  body,
  params,
  accessToken,
) => {
  const { axios } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post(
      'assets/vulnerabilities_asset',
      body,
      reqConfig,
    )

    return data
  }
  catch (error) {
    log.withError(error).error('requestUpdatePortVuln')
    return createAPIError(error)
  }
}
export const requestDeleteVuln = async (
  provider,
  _body,
  params,
  accessToken,
) => {
  const { axios } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('assets/vuln', params, reqConfig)
    return data
  }
  catch (error) {
    log.withError(error).error('requestDeleteVuln')
    return createAPIError(error)
  }
}
export const requestCreateVulnerability = async (
  provider,
  params,
  accessToken,
) => {
  const { axios } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/vulnerabilities', params, reqConfig)
    return { id: data.id }
  }
  catch (error) {
    log.withError(error).error('requestCreateVulnerability')
    return createAPIError(error)
  }
}
