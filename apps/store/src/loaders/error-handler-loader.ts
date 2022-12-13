/* eslint-disable @typescript-eslint/no-unused-vars */

// This rule is mandatory to avoid some mistakes about unused variables
import { isCelebrateError } from 'celebrate'
import {
  HTTPError,
  getBadRequestError,
  getInternalServerError,
} from '../../src/common/errors/http'

/**
 *
 * @param {any} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 * @returns
 */
export const errorHandler = (err: any, req: any, res: any, _next: any) => {
  let httpError = getInternalServerError()

  if (err instanceof HTTPError) {
    httpError = err
    req.log.withError(err).error('Error handler: http error')
  }
  else if (isCelebrateError(err)) {
    let message = 'ValidatonErrpr'

    // TODO: fix this useless loop
    // eslint-disable-next-line no-unreachable-loop
    for (const [_segment, joiError] of err.details.entries()) {
      message = joiError.message
      break
    }

    httpError = getBadRequestError({
      errorType: 'ValidationError',
      message,
    })
    req.log.withError(err).error('Error handler: celebrate error')
  }
  else {
    // Log if error is unhandled
    req.log.withError(err).error('Error handler: Unhandled error')
  }

  return res.status(httpError.code).send(httpError.toJSON())
}

export default async function loadErrorHandler(app: any) {
  app.use(errorHandler)
}