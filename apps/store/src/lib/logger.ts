import pino from 'pino'
import { LogLayer, LoggerType } from 'loglayer'
import PinoPretty from 'pino-pretty'
import pinosEs from 'pino-elasticsearch'
import {
  ELASTICSEARCH_URL,
  INSTANCE_NAME,
  appVersion,
  isProd,
} from '../../src/config/env'

const streams: (pino.DestinationStream | pino.StreamEntry)[] = [
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
      index: isProd ? 'operator' : 'dev-operator', // Index is needed to sort logs
      node: ELASTICSEARCH_URL,
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
