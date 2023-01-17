import type { NuxtAxiosInstance } from '@nuxtjs/axios'

export const loginService = async (axios: NuxtAxiosInstance, params: { username: string; password: string }) => {
  const { username, password } = params
  if (!username || !password)
    throw new Error('Username and password required')

  const {
    data: { accessToken, user, is2faInitialized },
  } = await axios.post('/login/credentials', { password, username }, {
    withCredentials: true,
  })
  return { accessToken, is2faInitialized, user }
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

export const twoFactorSetupService = (axios: NuxtAxiosInstance):
Promise<{ data: { seed: string; seedUrl: string } }> => {
  return axios.get('/two-factor/setup')
}

export const loginTotpService = (axios: NuxtAxiosInstance,
  /**
   * 6 digit totp code
   */
  totp: string | number) => {
  return axios.post('/login/totp', { totp }, { withCredentials: true })
}
