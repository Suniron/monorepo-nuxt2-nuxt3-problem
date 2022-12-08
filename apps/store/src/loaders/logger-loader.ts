// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'

/**
 * Loads a logger to an Expres app
 *
 * @param {import('express').Application} app Express app
 */
export default async function loadLogger(app: any) {
  app.use(
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    (req: any, res: any, next: any) => {
      const startHrTime = process.hrtime()

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
