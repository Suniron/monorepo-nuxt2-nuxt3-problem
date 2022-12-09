import { throwHTTPError } from '../../common/errors'

import { createIpModel, deleteIpModel, updateIpModel } from '../../models/ips'

export const deleteIpController = async (req: any, res: any, next: any) => {
  try {
    const { status, error } = await deleteIpModel(req.params?.id)

    if (error)
      throwHTTPError(error)

    res.status(204).send(status)
  }
  catch (error) {
    next(error)
  }
}

export const updateIpController = async (req: any, res: any, next: any) => {
  try {
    const { status, error } = await updateIpModel(req.body, req.params.id)

    if (error)
      throwHTTPError(error)

    res.status(204).send(status)
  }
  catch (error) {
    next(error)
  }
}

export const createIpController = async (req: any, res: any, next: any) => {
  try {
    const { ipId, error } = await createIpModel(req.params.assetId, req.body)

    if (error)
      throwHTTPError(error)

    res.status(201).send({ ipId })
  }
  catch (error) {
    next(error)
  }
}
