import { throwHTTPError } from '@/common/errors'
import { passThroughService } from '@/services'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const passThroughController = async (req, res, next) => {
  try {
    const storeResponse = await passThroughService(
      req.originalUrl,
      req.method,
      req.query,
      req.body,
      req.accessToken
    )
    if (storeResponse.error) throwHTTPError(storeResponse.error)
    res.status(storeResponse.status).send(storeResponse.data)
  } catch (error) {
    next(error)
  }
}
