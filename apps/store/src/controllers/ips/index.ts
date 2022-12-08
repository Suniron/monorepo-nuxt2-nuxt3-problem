import { throwHTTPError } from '@/common/errors'
import { deleteIpModel, updateIpModel, createIpModel } from '@/models/ips'

export const deleteIpController = async (req, res, next) => {
  try {
    const { status, error } = await deleteIpModel(req.params?.id)

    if (error) throwHTTPError(error)

    res.status(204).send(status)
  } catch (error) {
    next(error)
  }
}

export const updateIpController = async (req, res, next) => {
  try {
    const { status, error } = await updateIpModel(req.body, req.params.id)

    if (error) throwHTTPError(error)

    res.status(204).send(status)
  } catch (error) {
    next(error)
  }
}

export const createIpController = async (req, res, next) => {
  try {
    const { ipId, error } = await createIpModel(req.params.assetId, req.body)

    if (error) throwHTTPError(error)

    res.status(201).send({ ipId })
  } catch (error) {
    next(error)
  }
}
