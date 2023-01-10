import type { P } from 'pino'
import pino from 'pino'
import { LogLayer, LoggerType } from 'loglayer'
import PinoPretty from 'pino-pretty'
import pinosEs from 'pino-elasticsearch'
import type { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import {
  ELASTICSEARCH_URL,
  INSTANCE_NAME,
  appVersion,
  isProduction,
  isTest,
} from '../../src/config/env'

const streams: (pino.DestinationStream | pino.StreamEntry)[] = [
  {
    level: 'trace',
    stream: PinoPretty({
      colorize: true,
      customPrettifiers: {
        req: (req) => {
          if (req) {
            const { method, url, params, query, body, app, duration } = req as Request
            const keysToLog: any = {
              app,
              duration,
              method,
              url,
            }

            if (!isEmpty(params))
              keysToLog.params = params

            if (!isEmpty(query))
              keysToLog.query = query

            if (!isEmpty(body))
              keysToLog.body = body

            return JSON.stringify(keysToLog)
          }
          return ''
        },
        res: (res) => {
          if (res) {
            const { statusCode, statusMessage, cookie, json, status } = res as Response
            return JSON.stringify({
              cookie,
              json,
              status,
              statusCode,
              statusMessage,
            })
          }
          return ''
        },
      },
      singleLine: true,
    }),
  },
]

if (!isTest && ELASTICSEARCH_URL) {
  // eslint-disable-next-line no-console
  console.log('Log will be sent to Elasticsearch')
  streams.push({
    level: 'trace',
    stream: pinosEs({
      index: isProduction ? 'operator' : 'dev-operator', // Index is needed to sort logs
      node: ELASTICSEARCH_URL,
    }),
  })
}

// We only need to create the logging library instance once
const p = pino(
  {
    enabled: true, // !isTest,
    level: 'trace', // this MUST be set at the lowest level of the destinations,
    redact: isProduction
      ? [
          'req.body.password',
          'req.body.password1',
          'req.body.password2',
          'req.body.oldPassword',
          'req.headers.authorization',
          'req.headers.cookie',
        ]
      : [],
  },
  pino.multistream(streams),
)

export const log = new LogLayer({
  logger: {
    instance: p,
    type: LoggerType.PINO,
  },
  // error: {
  //   serializer: (err) => {
  //     // Add a request id for each new request
  //     return JSON.stringify(err, Object.getOwnPropertyNames(err))
  //   },
  // },
}).withContext({
  app: {
    name: 'store',
    version: appVersion,
  },

  date: new Date().toISOString(),
  // let's also add in some additional details about the server
  env: process.env.NODE_ENV,
  instance: {
    name: INSTANCE_NAME,
  },
})

export type Logger = LogLayer<P.Logger>
