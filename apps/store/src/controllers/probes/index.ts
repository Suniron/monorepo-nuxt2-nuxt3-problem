import type { NextFunction, Request, Response } from 'express'
import { throwHTTPError } from '../../common/errors'

import { searchProbesModel, updateProbeModel } from '../../models/probes'

export const searchProbesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, probes } = await searchProbesModel(
      {
        ...(req.params || {}),
      },
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.send(probes)
  }
  catch (error) {
    next(error)
  }
}

export const updateProbeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await updateProbeModel(
      {
        ...(req.params || {}),
      },
      req.body,
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.sendStatus(204)
  }
  catch (error) {
    next(error)
  }
}
