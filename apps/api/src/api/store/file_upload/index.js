import { contentSecurityPolicy } from 'helmet'
import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'
import { createServiceError } from '@/common/errors/service'
const TMP_DIR = '@/storage/tmp/'
const SAVED_DIR = '@/storage/saved/'

export const requestUploadFiles = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const { name, size, md5, mimetype } = params
    const bodyPayload = { md5, mimetype, name, size }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/files', bodyPayload, reqConfig)
    return { uuid: data.uuid }
  }
  catch (error) {
    return createAPIError(error)
  }
}

export const requestDownloadFile = async (provider, id, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/files/${id}`, reqConfig)
    return data
  }
  catch (error) {
    return createAPIError(error)
  }
}

export const requestProcessCSV = async (provider, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/files/processCSV', reqConfig)
    return data.error ? createServiceError(error) : data.isAuthorized
  }
  catch (error) {
    return createAPIError(error)
  }
}
