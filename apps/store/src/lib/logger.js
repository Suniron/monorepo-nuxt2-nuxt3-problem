// @ts-check
import pino from 'pino'
import { LogLayer, LoggerType } from 'loglayer'
import PinoPretty from 'pino-pretty'
import {
  appVersion,
  ELASTICSEARCH_URL,
  INSTANCE_NAME,
  isProd,
} from '@/config/env'
import pinosEs from 'pino-elasticsearch'

/**
 * @type {(pino.DestinationStream | pino.StreamEntry)[]}
 */
const streams = [
  {
    level: 'trace',
    stream: PinoPretty({
      colorize: true,
    }),
  },
]

if (process.env.NODE_ENV !== 'test' && ELASTICSEARCH_URL) {
  console.log('Log will be sent to Elasticsearch')
  streams.push({
    level: 'trace',
    stream: pinosEs({
      node: ELASTICSEARCH_URL,
      index: isProd ? 'operator' : 'dev-operator', // Index is needed to sort logs
    }),
  })
}

// We only need to create the logging library instance once
const p = pino(
  {
    enabled: process.env.NODE_ENV !== 'test',
    level: 'trace', // this MUST be set at the lowest level of the destinations,
    redact: [
      'req.body.password',
      'req.body.password1',
      'req.body.password2',
      'req.body.oldPassword',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
  },
  pino.multistream(streams)
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
  // let's also add in some additional details about the server
  env: process.env.NODE_ENV,
  instance: {
    name: INSTANCE_NAME,
  },
  date: new Date().toISOString(),
})
