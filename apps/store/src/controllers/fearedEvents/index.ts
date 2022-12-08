// @ts-check
/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} NextFunction
 */
// @ts-expect-error TS(2307): Cannot find module '@/common/errors/index.js' or i... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors/index.js'
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
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
      req.user
    )

    if ('error' in results) throwHTTPError(results.error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
