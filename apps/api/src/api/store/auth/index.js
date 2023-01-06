import { createAPIError } from '@/common/errors/api'
import { createServiceError } from '@/common/errors/service'

export const requestLogin = async (provider, params) => {
  const { logger, axios } = provider
  try {
    const { username, password } = params
    const bodyParams = { password, username }

    const response = await axios.post('/login/password', bodyParams)
    const accessToken = response.data.accessToken || ''
    const refreshTokenCookie = response.headers['set-cookie'] || ''
    const user = response.data.userInfo

    return { accessToken, refreshTokenCookie, user }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestRefreshToken = async (
  provider,
  refreshToken,
  currentAccessToken,
) => {
  const { logger, axios } = provider
  try {
    const {
      data: { accessToken, user },
    } = await axios.post(
      'refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
          Cookie: `rt=${refreshToken}`,
        },
        withCredentials: true,
      },
    )

    return { accessToken, user }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestLogout = async (provider, accessToken) => {
  const { logger, axios } = provider
  try {
    const response = await axios.delete('logout', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const refreshTokenCookie = response.headers['set-cookie'] || ''

    return { refreshTokenCookie }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestIsAuthorized = async (provider, accessToken) => {
  const { axios } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/is-authorized', reqConfig)
    return data.error ? createServiceError(data.error) : data
  }
  catch (error) {
    return createAPIError(error)
  }
}
export const requestSendResetPasswordMail = async (provider, params) => {
  const { logger, axios } = provider
  try {
    const { username } = params
    const bodyParams = { username }

    const response = await axios.post('reset-password', bodyParams)
    const { resetToken, email } = response.data
    return { email, resetToken }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateResetPasswordByToken = async (provider, params) => {
  const { logger, axios } = provider
  try {
    const { password, token } = params
    const bodyParams = { password, token }
    const response = await axios.patch('reset-password', bodyParams)
    return response
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
