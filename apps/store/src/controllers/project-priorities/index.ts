// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors/index.js' or i... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors/index.js'
// @ts-expect-error TS(2307): Cannot find module '@/models/project-priorities' o... Remove this comment to see the full error message
import { searchProjectPrioritiesModel } from '@/models/project-priorities'

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

    if (results.error) throwHTTPError(results.error)

    res.send(results)
  } catch (error) {
    next(error)
  }
}
