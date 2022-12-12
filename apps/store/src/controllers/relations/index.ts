import { throwHTTPError } from '../../common/errors'
import {
  createBulkRelationModel,
  createRelationModel,
  deleteRelationByAssetsIdsModel,
  deleteRelationModel,
  updateRelationModel,
} from '../../models/relations'

export const createRelationController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, id } = await createRelationModel(req.body, req.user)

    if (error)
      throwHTTPError(error)

    res.status(201).send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const createBulkRelationController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, ids } = await createBulkRelationModel(req.body, req.user)

    if (error)
      throwHTTPError(error)

    res.status(201).send(ids)
  }
  catch (error) {
    next(error)
  }
}

export const updateRelationController = async (
  req: any,
  res: any,
  next: any,
) => {
  // TODO: check permissions

  try {
    const { error, id } = await updateRelationModel(req.params?.relId, req.body)

    if (error)
      throwHTTPError(error)

    res.status(201).send({ id })
  }
  catch (error) {
    next(error)
  }
}

export const deleteRelationController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, status } = await deleteRelationModel(
      req.params?.relId,
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.status(201).send({ status })
  }
  catch (error) {
    next(error)
  }
}

export const deleteRelationByAssetsIdsController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, count } = await deleteRelationByAssetsIdsModel({
      fromAssetId: parseInt(req.params.fromAssetId),
      relationType: req.params.relationType,
      toAssetId: parseInt(req.params.toAssetId),
    })

    if (error)
      throwHTTPError(error)

    res.status(200).send({ count })
  }
  catch (error) {
    next(error)
  }
}
