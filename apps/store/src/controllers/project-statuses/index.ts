import { throwHTTPError } from '../../common/errors/'

import { getAvailableTransitionsModel } from '../../models/project-statuses'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getAvailableTransitionsController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const results = await getAvailableTransitionsModel({
      ...(req.params || {}),
      ...(req.query || {}),
    })

    if ('error' in results)
      throwHTTPError(results.error)

    res.send(results)
  }
  catch (error) {
    next(error)
  }
}
