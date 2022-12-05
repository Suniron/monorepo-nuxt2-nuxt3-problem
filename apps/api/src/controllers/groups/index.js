import { throwHTTPError } from '@/common/errors'
import {
  searchGroupsService,
  updateGroupService,
  createGroupService,
  deleteGroupService,
} from '@/services/groups'

export const searchGroupsController = async (req, res, next) => {
  try {
    const { error, group, groups, total } = await searchGroupsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.send(group || { groups, total })
  } catch (error) {
    next(error)
  }
}

export const createGroupController = async (req, res, next) => {
  try {
    const { error, id } = await createGroupService(req.body, req.accessToken)
    if (error) throwHTTPError(error)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
}

export const updateGroupController = async (req, res, next) => {
  try {
    const { error, group } = await updateGroupService(
      {
        ...(req.params || {}),
        ...(req.body || {}),
      },
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.send(group)
  } catch (error) {
    next(error)
  }
}
export const deleteGroupController = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await deleteGroupService(id, req.accessToken)
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}
