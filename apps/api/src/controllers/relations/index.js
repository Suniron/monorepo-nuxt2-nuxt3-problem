import { throwHTTPError } from '@/common/errors'
import {
  createBulkRelationService,
  createRelationService,
  deleteRelationByAssetsIdsService,
  deleteRelationService,
  updateRelationService,
} from '@/services/relations'

export const createRelationController = async (req, res, next) => {
  try {
    const id = await createRelationService(req.body, req.accessToken)
    if (id?.error)
      throwHTTPError(id.error)
    res.status(201).send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const createBulkRelationController = async (req, res, next) => {
  try {
    const result = await createBulkRelationService(req.body, req.accessToken)
    if (result?.error)
      throwHTTPError(result.error)
    res.status(201).send(result)
  }
  catch (error) {
    next(error)
  }
}

export const updateRelationController = async (req, res, next) => {
  try {
    const id = await updateRelationService(
      req.params?.id,
      req.body,
      req.accessToken,
    )
    if (id?.error)
      throwHTTPError(id.error)
    res.status(201).send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const deleteRelationController = async (req, res, next) => {
  try {
    const status = await deleteRelationService(req.params?.id, req.accessToken)
    if (status?.error)
      throwHTTPError(status.error)
    res.status(201).send({ status })
  }
  catch (error) {
    next(error)
  }
}

export const deleteRelationByAssetsIdsController = async (req, res, next) => {
  try {
    const result = await deleteRelationByAssetsIdsService(
      req.params,
      req.accessToken,
    )
    if (result?.error)
      throwHTTPError(result.error)
    res.status(200).send(result)
  }
  catch (error) {
    next(error)
  }
}
