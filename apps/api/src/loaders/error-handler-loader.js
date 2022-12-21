import { isCelebrateError } from 'celebrate'
import { HTTPError, getBadRequestError, getInternalServerError } from '@/common/errors/http'

/**
 *
 * @param {*} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export const errorHandler = (err, req, res, _next) => {
  let httpError = getInternalServerError()

  if (err instanceof HTTPError) {
    httpError = err
    req.log.withError(err).error('Error handler: http error')
  }
  else if (isCelebrateError(err)) {
    let message = 'ValidatonErrpr'

    // TODO: fix this useless loop
    // eslint-disable-next-line no-unreachable-loop, @typescript-eslint/no-unused-vars
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

export default async function loadErrorHandler(app) {
  app.use(errorHandler)
}
