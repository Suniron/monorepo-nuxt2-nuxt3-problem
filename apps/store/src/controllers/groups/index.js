import { throwHTTPError } from '@/common/errors'
import { knex } from '@/common/db'
import {
  searchGroupsModel,
  updateGroupModel,
  createGroupModel,
  deleteGroupModel,
} from '@/models/groups'

export const searchGroupsController = async (req, res, next) => {
  try {
    const { error, group, groups, total } = await searchGroupsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(group || { groups, total })
  } catch (error) {
    next(error)
  }
}

export const createGroupController = async (req, res, next) => {
  try {
    const { error, id } = await createGroupModel(req.body, req.user)
    if (error) throwHTTPError(error)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
}

export const updateGroupController = async (req, res, next) => {
  try {
    const { error, message, group } = await updateGroupModel(
      {
        ...(req.params || {}),
        ...(req.body || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error, message)

    res.send(group)
  } catch (error) {
    next(error)
  }
}
export const deleteGroupController = async (req, res, next) => {
  try {
    const provider = { knex, logger: console }
    const data = await deleteGroupModel(provider, req.params.id, req.user)
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}
