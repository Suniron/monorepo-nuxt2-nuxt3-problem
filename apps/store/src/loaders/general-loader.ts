import helmet from 'helmet'

import compression from 'compression'
import bodyParser from 'body-parser'

import cors from 'cors'
import env from '../config/env'

import cookieParser from 'cookie-parser'

export default async function loadGeneral(app: any) {
  // adding Helmet to enhance your API's security
  app.use(helmet())
  // add gZip compression for better performance
  app.use(compression())

  // using bodyParser to parse JSON bodies into JS objects
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true })) // extended true means use 'qs' library for parsing

  // Parse cookies for easy access through "req" object
  app.use(cookieParser())

  // enabling CORS for all requests
  const origin = {
    origin: env.nodeEnv.isProduction ? '*' : '*', // TODO: change the is production for a valid origin
  }
  app.use(cors(origin))
}
