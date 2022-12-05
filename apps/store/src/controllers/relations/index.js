// @ts-check
import { throwHTTPError } from '@/common/errors'
import {
  createRelationModel,
  createBulkRelationModel,
  updateRelationModel,
  deleteRelationModel,
  deleteRelationByAssetsIdsModel,
} from '@/models/relations'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createRelationController = async (req, res, next) => {
  try {
    const { error, id } = await createRelationModel(req.body, req.user)

    if (error) throwHTTPError(error)

    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createBulkRelationController = async (req, res, next) => {
  try {
    const { error, ids } = await createBulkRelationModel(req.body, req.user)

    if (error) throwHTTPError(error)

    res.status(201).send(ids)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateRelationController = async (req, res, next) => {
  try {
    const { error, id } = await updateRelationModel(
      req.params?.relId,
      req.body,
      req.user
    )

    if (error) throwHTTPError(error)

    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteRelationController = async (req, res, next) => {
  try {
    const { error, status } = await deleteRelationModel(
      req.params?.relId,
      req.user
    )

    if (error) throwHTTPError(error)

    res.status(201).send({ status })
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteRelationByAssetsIdsController = async (req, res, next) => {
  try {
    const { error, count } = await deleteRelationByAssetsIdsModel(
      {
        fromAssetId: parseInt(req.params.fromAssetId),
        relationType: req.params.relationType,
        toAssetId: parseInt(req.params.toAssetId),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.status(200).send({ count })
  } catch (error) {
    next(error)
  }
}
