// @ts-check
import { throwHTTPError } from '@/common/errors/index.js'
import { searchGroupedRemediationsModel } from '@/models/remediations'

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
export const searchGroupedRemediationsController = async (req, res, next) => {
  try {
    const results = await searchGroupedRemediationsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if ('error' in results) throwHTTPError(results.error)

    res.send(results)
  } catch (error) {
    next(error)
  }
}
