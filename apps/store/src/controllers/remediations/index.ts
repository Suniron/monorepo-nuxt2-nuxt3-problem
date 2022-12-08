// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors/index.js' or i... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors/index.js'
// @ts-expect-error TS(2307): Cannot find module '@/models/remediations' or its ... Remove this comment to see the full error message
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
export const searchGroupedRemediationsController = async (req: any, res: any, next: any) => {
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
