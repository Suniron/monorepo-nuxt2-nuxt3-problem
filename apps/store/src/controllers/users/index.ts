import {
  createUser,
  searchUsersModel,
  updateUserModel,
  deleteUserModel,

} from '../../models/users'

import { knex } from '../../common/db'

import { hashSync, genSaltSync } from '../../common/auth/sha512'

import { createPasswordHash, passwordsMatch } from '../../common/auth/passwords'

import { throwHTTPError } from '../../common/errors'

export const searchUsersController = async (req: any, res: any, next: any) => {
  try {
    const provider = { knex, logger: console }
    const { error, user, users, total } = await searchUsersModel(
      provider,
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )
    if (error) throwHTTPError(error)

    res.status(200).send(user || { users, total })
  } catch (error) {
    next(error)
  }
}

export const createUserController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
        },
        password
      ),
    }
    const { error, id } = await createUser(provider, req.body, req.user)
    if (error) throwHTTPError(error)
    res.send({ id })
  } catch (err) {
    next(err)
  }
}

export const updateUserController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
        },
        password
      ),
      passwordsMatch: (password: any, hash: any, salt: any) =>
        passwordsMatch(
          {
            hashSync,
          },
          password,
          hash,
          salt
        ),
    }

    const { error, message, user } = await updateUserModel(
      provider,
      {
        ...(req.params || {}),
        ...(req.body || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error, message)
    res.status(200).send(user)
  } catch (error) {
    next(error)
  }
}
export const deleteUserController = async (req: any, res: any, next: any) => {
  try {
    const provider = { knex, logger: console }
    const data = await deleteUserModel(provider, req.params.id, req.user)
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}
