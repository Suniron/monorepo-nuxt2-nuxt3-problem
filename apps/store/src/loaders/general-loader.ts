import helmet from 'helmet'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'comp... Remove this comment to see the full error message
import compression from 'compression'
import bodyParser from 'body-parser'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cors... Remove this comment to see the full error message
import cors from 'cors'
// @ts-expect-error TS(2307): Cannot find module '@/config/env' or its correspon... Remove this comment to see the full error message
import env from '@/config/env'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cook... Remove this comment to see the full error message
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
