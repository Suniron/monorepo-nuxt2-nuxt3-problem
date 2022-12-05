// @ts-check
const getEndpoint = (id = '') => (id ? 'users/' + id : 'users')

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
    firstName: params.firstName,
    lastName: params.lastName,
    username: params.username,
    email: params.email,
    password: params.password,
    roles: [params.role]
  }
  try {
    const { data } = await axios.post(getEndpoint(), bodyParams)
    return data
  } catch (e) {
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
    password2
  } = params
  if (!id) throw new Error('Param "id" required to update user')
  // if (!groups && !roles) throw new Error('There is nothing to update')

  const bodyPayload = {
    roles,
    username,
    email,
    groupIds: Array.isArray(groups) ? groups.map((g) => g.id) : undefined,
    firstName,
    lastName,
    oldPassword,
    password1,
    password2
  }
  const { data } = await axios.patch(getEndpoint(id), bodyPayload)

  return data
}

export const deleteUserService = async (axios, params = {}) => {
  const { id } = params
  const data = await axios.delete(getEndpoint(id))
  return data
}
