// @ts-check
import { log } from '@/lib/logger'
import { v4 as uuidv4 } from 'uuid'

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

      req.log = log.child().withContext({
        // generate a random request id to improve tracing
        req: {
          id: uuidv4(),
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
