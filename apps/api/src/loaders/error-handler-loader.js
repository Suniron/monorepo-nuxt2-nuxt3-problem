import { isCelebrateError } from 'celebrate'
import { HTTPError, getBadRequestError } from '@/common/errors/http'

/**
 *
 * @param {*} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export const errorHandler = (err, req, res, _next) => {
  if (isCelebrateError(err)) {
    // TODO: is there a better way to get the error message?
    const message = err.details.entries()[0][1].message

    req.log.withError(err).error('errorHandler: celebrate error')
    return getBadRequestError({
      errorType: 'ValidationError',
      message,
    })
  }

  const httpError = new HTTPError(err.code ?? 500, {
    errorType: err.errorType,
    message: err.message,
  })

  req.log.withError(err).error('errorHandler: http error')
  return res.status(httpError.code).send(httpError.toJSON())
}

export default async function loadErrorHandler(app) {
  app.use(errorHandler)
}
