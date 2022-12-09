// @ts-check
/**
 *
 * @param { import("@nuxtjs/axios").NuxtAxiosInstance } axios
 * @param { Object } params
 */
export const loginService = async (axios, params = {}) => {
  const { username, password } = params
  if (!username || !password)
    throw new Error('Username and password required')

  const bodyParams = { password, username }
  const {
    data: { accessToken, user },
  } = await axios.post('login', bodyParams, {
    withCredentials: true,
  })
  return { accessToken, user }
}

/**
 *
 * @param { import("@nuxtjs/axios").NuxtAxiosInstance } axios
 */
export const refreshTokenService = async (axios) => {
  const {
    data: { accessToken, user },
  } = await axios.post('refresh-token', {}, { withCredentials: true })

  return { accessToken, user }
}

/**
 *
 * @param { import("@nuxtjs/axios").NuxtAxiosInstance } axios
 */
export const logoutService = axios =>
  axios.delete('logout', { withCredentials: true })

/**
 *
 * @param { import("@nuxtjs/axios").NuxtAxiosInstance } axios
 * @param { Object } params
 */
export const sendResetPasswordMail = async (axios, params = {}) => {
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

/**
 *
 * @param { import("@nuxtjs/axios").NuxtAxiosInstance } axios
 * @param { Object } params
 */
export const updatePasswordByToken = async (axios, params = {}) => {
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
