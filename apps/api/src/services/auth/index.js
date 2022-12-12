import { authAPIs } from '@/api/store'
import { VALIDATION_ERROR } from '@/common/constants'
import { createServiceError } from '@/common/errors/service'
import { PASSWORD_VALIDATION_REGEXP } from '@/common/regexps/users'

export const loginService = async (params) => {
  const { username, password } = params
  const { error, accessToken, refreshTokenCookie, user } = await authAPIs.login(
    {
      password,
      username,
    },
  )
  if (error)
    return createServiceError(error)
  return { accessToken, refreshTokenCookie, user }
}

export const refreshAccessTokenService = async (refreshToken, accessToken) => {
  const {
    error,
    accessToken: newAccessToken,
    user,
  } = await authAPIs.refreshToken(refreshToken, accessToken)

  return error
    ? createServiceError(error)
    : { accessToken: newAccessToken, user }
}

export const logoutService = async (accessToken) => {
  const { error, refreshTokenCookie } = await authAPIs.logout(accessToken)
  return error ? createServiceError(error) : { refreshTokenCookie }
}

export const isAuthorizedService = async (accessToken) => {
  const isAuthorized = await authAPIs.isAuthorized(accessToken)
  return isAuthorized
}

export const sendResetPasswordMail = async (params) => {
  const { username } = params
  const { error, resetToken, email } = await authAPIs.sendResetPasswordMail({
    username,
  })
  if (error)
    return createServiceError(error)
  return { email, resetToken }
}
export const updateResetPasswordByToken = async (params) => {
  const { password, token } = params
  if (PASSWORD_VALIDATION_REGEXP.test(password)) {
    const response = await authAPIs.updateResetPasswordByToken({
      password,
      token,
    })
    return response.error ? createServiceError(response.error) : response
  }
  else {
    return createServiceError(VALIDATION_ERROR, 'Invalid password')
  }
}
