import { createAPIError } from '@/common/errors/api'

export const requestFetchCartographies = async (provider, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/cartographies', reqConfig)
    return { cartographies: data.cartographies }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestFetchCartographyElements = async (
  provider,
  id,
  accessToken = ''
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/cartographies/' + id, reqConfig)
    return { elements: data.elements }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateCartography = async (
  provider,
  id,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.patch('/cartographies/' + id, params, reqConfig)
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateCartography = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/cartographies', params, reqConfig)
    return data.id
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteCartography = async (provider, id, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.delete('/cartographies/' + id, reqConfig)
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteCartographyElement = async (
  provider,
  id,
  eid,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.delete('/cartographies/' + id + '/elements/' + eid, reqConfig)
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestAddCartographyElement = async (
  provider,
  id,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post(
      '/cartographies/' + id + '/elements',
      params,
      reqConfig
    )
    return data.id
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateCartographyElement = async (
  provider,
  id,
  eid,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.patch(
      '/cartographies/' + id + '/elements/' + eid,
      params,
      reqConfig
    )
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
