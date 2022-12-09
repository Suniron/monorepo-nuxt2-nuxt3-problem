

import { throwHTTPError } from '../../common/errors/index.js'

import { searchSeveritiesModel } from '../../models/severities'

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
export const searchSeveritiesController = async (req: any, res: any, next: any) => {
  try {
    const results = await searchSeveritiesModel({
      ...(req.params || {}),
      ...(req.query || {}),
    })

    if ('error' in results) throwHTTPError(results.error)

    res.send(results)
  } catch (error) {
    next(error)
  }
}
