import { throwHTTPError } from '../../common/errors/'

import { searchProjectPrioritiesModel } from '../../models/project-priorities'

/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const searchProjectPrioritiesController = async (req: any, res: any, next: any) => {
  try {
    const results = await searchProjectPrioritiesModel({
      ...(req.params || {}),
      ...(req.query || {}),
    })

    if (results.error)
      throwHTTPError(results.error)

    res.send(results)
  }
  catch (error) {
    next(error)
  }
}
