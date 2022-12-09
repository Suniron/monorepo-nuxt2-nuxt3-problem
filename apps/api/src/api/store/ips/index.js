import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
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
      return createAPIError(error)
    const res = await axios.delete(`/ips/${id}`, { ...reqConfig })
    return res.status === 204 ? { SUCCESS } : createAPIError(error)
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
      return createAPIError(error)
    const res = await axios.patch(`/ips/${id}`, body, reqConfig)
    return res.status === 204 ? { SUCCESS } : createAPIError(error)
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
      return createAPIError(error)
    const res = await axios.post(`/ips/${assetId}`, body, reqConfig)
    const ipId = res.data.ipId
    return res.status === 201 ? { ipId } : createAPIError(error)
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
