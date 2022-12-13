// @ts-check
const getEndpoint = (id = '') => (id ? `users/${id}` : 'users')

/**
 *
 * @param {import("@nuxtjs/axios").NuxtAxiosInstance} axios
 * @param {*} params
 * @returns {Promise<{users: import("~/types/user").User[]}>}
 */
export const searchUsersService = async (axios, params = {}) => {
  const { data } = await axios.get(getEndpoint(), { params })
  return data
}

export const createUserService = async (axios, params = {}) => {
  const bodyParams = {
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    password: params.password,
    roles: [params.role],
    username: params.username,
  }
  try {
    const { data } = await axios.post(getEndpoint(), bodyParams)
    return data
  }
  catch (e) {
    return false
  }
}

export const updateUserService = async (axios, params) => {
  const {
    id,
    username,
    email,
    groups,
    roles,
    firstName,
    lastName,
    oldPassword,
    password1,
    password2,
  } = params
  if (!id)
    throw new Error('Param "id" required to update user')
  // if (!groups && !roles) throw new Error('There is nothing to update')

  const bodyPayload = {
    email,
    firstName,
    groupIds: Array.isArray(groups) ? groups.map(g => g.id) : undefined,
    lastName,
    oldPassword,
    password1,
    password2,
    roles,
    username,
  }
  const { data } = await axios.patch(getEndpoint(id), bodyPayload)

  return data
}

export const deleteUserService = async (axios, params = {}) => {
  const { id } = params
  const data = await axios.delete(getEndpoint(id))
  return data
}
