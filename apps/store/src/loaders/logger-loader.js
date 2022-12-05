// @ts-check
import { log } from '@/lib/logger'

/**
 * Loads a logger to an Expres app
 *
 * @param {import('express').Application} app Express app
 */
export default async function loadLogger(app) {
  app.use(
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    (req, res, next) => {
      const startHrTime = process.hrtime()

      // @ts-expect-error: define the logger
      req.log = log.child().withContext({
        // generate a random request id to improve tracing
        reqId: Math.floor(Math.random() * 100000).toString(10),
        req: {
          id: req.id,
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          headers: req.headers,
          remoteAddress: req.ip,
          body: req.body,
        },
        res: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
        type: 'request',
      })

      // Log each request to get all infos & duration
      res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime)
        const elapsedTimeInMs = Math.round(
          elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
        )
        req.log
          .withMetadata({ duration: elapsedTimeInMs })
          .debug('Request finished')
      })

      next()
    }
  )
}
