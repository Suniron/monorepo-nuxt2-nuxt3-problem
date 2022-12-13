import {
  createUserService,
  deleteUserService,
  searchUsersService,
  updateUserService,
} from '@/services/users'
import { userAPIs } from '@/api/store'
import { throwHTTPError } from '@/common/errors'

export const searchUsersController = async (req, res, next) => {
  try {
    const provider = { userAPIs }
    const { error, user, users, total } = await searchUsersService(
      provider,
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(200).send(user || { total, users })
  }
  catch (error) {
    next(error)
  }
}

export const createUserController = async (req, res, next) => {
  try {
    const provider = { userAPIs }
    const { error, id } = await createUserService(
      provider,
      req.body,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const updateUserController = async (req, res, next) => {
  try {
    const provider = { userAPIs }
    const { error, user } = await updateUserService(
      provider,
      {
        ...(req.params || {}),
        ...(req.body || {}),
      },
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)
    res.status(200).send(user)
  }
  catch (error) {
    next(error)
  }
}
export const deleteUserController = async (req, res, next) => {
  try {
    const provider = { userAPIs }
    const { id } = req.params
    const data = await deleteUserService(provider, id, req.accessToken)
    if (data.error)
      throwHTTPError(data.error)
    res.send(data)
  }
  catch (error) {
    next(error)
  }
}
