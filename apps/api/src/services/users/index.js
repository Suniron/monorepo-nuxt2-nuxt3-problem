import { VALIDATION_ERROR } from '@/common/constants'
import { createServiceError } from '@/common/errors/service'
import { PASSWORD_VALIDATION_REGEXP } from '@/common/regexps/users'

const formatUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    roles: user.roles,
    groups: user.groups.map((g) => ({ id: g.id, name: g.name })),
  }
}

export const searchUsersService = async (
  provider,
  params,
  accessToken = ''
) => {
  const { userAPIs } = provider
  const { error, user, users, total } = await userAPIs.searchUsers(
    params,
    accessToken
  )
  if (error) return createServiceError(error)

  return user
    ? { user: formatUser(user) }
    : { users: users.map(formatUser), total }
}

export const createUserService = async (provider, params, accessToken = '') => {
  const { userAPIs } = provider
  const { password } = params
  if (PASSWORD_VALIDATION_REGEXP.test(password)) {
    const { error, id } = await userAPIs.createUser(params, accessToken)
    return error ? createServiceError(error) : { id }
  } else {
    return createServiceError(VALIDATION_ERROR, 'Invalid password')
  }
}

export const updateUserService = async (provider, params, accessToken = '') => {
  const { userAPIs } = provider
  const { oldPassword, password1, password2 } = params
  if (!oldPassword && !password1 && !password2)
    if (password1 !== password2 && !PASSWORD_VALIDATION_REGEXP.test(password1))
      return createServiceError('Invalid password')
  const { error, user } = await userAPIs.updateUser(params, accessToken)

  return error ? createServiceError(error) : { user: formatUser(user) }
}

export const deleteUserService = async (provider, id, accessToken = '') => {
  const { userAPIs } = provider
  const { error, data } = await userAPIs.deleteUser(id, accessToken)
  return error ? createServiceError(error) : data
}
