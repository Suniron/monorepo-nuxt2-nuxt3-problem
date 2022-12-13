import { SUCCESS } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const deleteIpStore = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    if (!id)
      throw new Error('Missing asset id')

    const res = await axios.delete(`/ips/${id}`, { ...reqConfig })
    if (res.status !== 204)
      throw new Error('Bad res status: not 204')

    return { SUCCESS }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const updateIpStore = async (provider, body, accessToken, id) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    if (!id)
      throw new Error('Missing asset id')

    const res = await axios.patch(`/ips/${id}`, body, reqConfig)
    if (res.status !== 204)
      throw new Error('Bad res status: not 204')

    return { SUCCESS }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const createIpStore = async (provider, body, accessToken, assetId) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    if (!assetId)
      throw new Error('Missing asset id')

    const res = await axios.post(`/ips/${assetId}`, body, reqConfig)
    const ipId = res.data.ipId

    if (res.status !== 201)
      throw new Error('Bad res status: not 201')

    return { ipId }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
