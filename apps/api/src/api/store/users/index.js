import { VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

const getEndpoint = (id = '') => (id ? 'users/' + id : 'users')

const getRequestConfig = (accessToken) => ({
  ...(accessToken && {
    headers: { Authorization: `Bearer ${accessToken}` },
  }),
})

export const requestSearchUsers = async (
  provider,
  params,
  accessToken = ''
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = getRequestConfig(accessToken)
    const { id } = params

    if (id) return { user: (await axios.get(getEndpoint(id), reqConfig)).data }

    const {
      data: { users, total },
    } = await axios.get(getEndpoint(), {
      ...reqConfig,
      params: params,
    })

    return { users, total }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const createUser = async (provider, params, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const { email, username, password, firstName, lastName, roles } = params
    const payload = { email, username, password, firstName, lastName, roles }
    const reqConfig = getRequestConfig(accessToken)

    const {
      data: { id },
    } = await axios.post(getEndpoint(), payload, reqConfig)

    return { id }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateUser = async (provider, params, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const {
      id,
      email,
      username,
      roles,
      groupIds,
      firstName,
      lastName,
      oldPassword,
      password1,
      password2,
    } = params
    if (!id) {
      logger.error(new Error('Param "id" is required to update a user'))
      return { error: VALIDATION_ERROR }
    }

    const payload = {
      username,
      email,
      roles,
      groupIds,
      firstName,
      lastName,
      lastName,
      oldPassword,
      password1,
      password2,
    }
    const reqConfig = getRequestConfig(accessToken)

    const { data: user } = await axios.patch(
      getEndpoint(id),
      payload,
      reqConfig
    )

    return { user }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteUser = async (provider, id, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = getRequestConfig(accessToken)
    const data = await axios.delete(getEndpoint(id), reqConfig)
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
