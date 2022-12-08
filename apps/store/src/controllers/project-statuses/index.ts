// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors/index.js' or i... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors/index.js'
// @ts-expect-error TS(2307): Cannot find module '@/models/project-statuses' or ... Remove this comment to see the full error message
import { getAvailableTransitionsModel } from '@/models/project-statuses'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getAvailableTransitionsController = async (req: any, res: any, next: any) => {
  try {
    const results = await getAvailableTransitionsModel({
      ...(req.params || {}),
      ...(req.query || {}),
    })

    if ('error' in results) throwHTTPError(results.error)

    res.send(results)
  } catch (error) {
    next(error)
  }
}
