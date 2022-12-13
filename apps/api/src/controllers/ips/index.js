import { throwHTTPError } from '@/common/errors'

import {
  createIpControllerService,
  deleteIpControllerService,
  updateIpControllerService,
} from '@/services/ips'

export const deleteIpController = async (req, res, next) => {
  try {
    const { SUCCESS, error } = await deleteIpControllerService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(204).send({ SUCCESS })
  }
  catch (error) {
    next(error)
  }
}

export const updateIpController = async (req, res, next) => {
  try {
    const { SUCCESS, error } = await updateIpControllerService(
      req.body,
      req.accessToken,
      req.params.id,
    )
    if (error)
      throwHTTPError(error)

    res.status(204).send({ SUCCESS })
  }
  catch (error) {
    next(error)
  }
}

export const createIpController = async (req, res, next) => {
  try {
    const { ipId, error } = await createIpControllerService(
      req.body,
      req.accessToken,
      req.params.assetId,
    )
    if (error)
      throwHTTPError(error)

    res.status(201).send({ ipId })
  }
  catch (error) {
    next(error)
  }
}
