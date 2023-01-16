import type { NuxtAxiosInstance } from '@nuxtjs/axios'

export const loginService = async (axios: NuxtAxiosInstance, params: { username: string; password: string }) => {
  const { username, password } = params
  if (!username || !password)
    throw new Error('Username and password required')

  const bodyParams = { password, username }
  const {
    data: { accessToken, user },
  } = await axios.post('/login/credentials', bodyParams, {
    withCredentials: true,
  })
  return { accessToken, user }
}

export const refreshTokenService = async (axios: NuxtAxiosInstance) => {
  const {
    data: { accessToken, user },
  } = await axios.post('refresh-token', {}, { withCredentials: true })

  return { accessToken, user }
}

export const logoutService = (axios: NuxtAxiosInstance) =>
  axios.delete('logout', { withCredentials: true })

export const sendResetPasswordMail = async (axios: NuxtAxiosInstance, params: { username: string }) => {
  const { username } = params
  if (!username)
    throw new Error('Username or email required')

  const data = await axios.post(
    'reset-password',
    { username },
    {
      withCredentials: true,
    },
  )
  return data
}

export const updatePasswordByToken = async (axios: NuxtAxiosInstance, params: { password: string; token: string }) => {
  const { password, token } = params
  const data = await axios.patch(
    'reset-password',
    {
      password,
      token,
    },
    {
      withCredentials: true,
    },
  )
  return data
}
