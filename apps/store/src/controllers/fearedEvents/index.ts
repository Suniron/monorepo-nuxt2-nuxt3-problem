/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} NextFunction
 */

import { throwHTTPError } from '../../common/errors/index.js'
import { updateFearedEventsModel } from '../../models/fearedEvents'

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const updateFearedEventsController = async (req: any, res: any, next: any) => {
  try {
    const results = await updateFearedEventsModel(
      req.params?.id,
      req.body,

      req.user,
    )

    if ('error' in results)
      throwHTTPError(results.error)

    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}
