// @ts-check
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import env from '@/config/env'
import fileUpload from 'express-fileupload'

export default async function loadGeneral(app) {
  // adding Helmet to enhance your API's security
  app.use(helmet())
  // add gZip compression for better performance
  app.use(compression())

  // using bodyParser to parse JSON bodies into JS objects
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true })) // extended true means use 'qs' library for parsing

  // using cookieParser to parse cookies into JS object
  app.use(cookieParser())

  app.use(fileUpload({ createParentPath: true }))

  const corsSafelist = [env.ui.origin, 'http://localhost:3000']

  // If is not production, cors allow all (usefull for postman for example)
  if (!env.nodeEnv.isProduction) {
    corsSafelist.push('*')
  }

  /**
   * @type {import('cors').CorsOptions}
   */
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || corsSafelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('CORS error'))
      }
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  }

  app.use(cors(corsOptions))
}
