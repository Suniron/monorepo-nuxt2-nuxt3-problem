import https from 'https'
import fs from 'fs'
import path from 'path'
import initServer from '../src/server'
import env from './config/env'
import { initCronTasks } from './tasks'
import { log } from './lib/logger'

/**
 * This function must be called when the server is started (with https or not)
 */
const onServerStart = () => {
  log.info(`Server started on port ${env.port}`)

  // Initialize cron tasks system:
  initCronTasks()
}

async function startServer() {
  const app = await initServer()

  if (env.nodeEnv.isProduction && !env.httpsEnabled) {
    console.warn(
      '[WARN] Building for production without certificate. Please provide both `server_key.pem` and `server_cert.pem` files.',
    )
  }
  if (env.nodeEnv.isProduction && env.httpsEnabled) {
    const readConfigFile = (filename: any) => fs.readFileSync(path.resolve(__dirname, '../secrets/', filename))
    const httpsOpts = {
      ca: [readConfigFile('api_cert.pem')],
      cert: readConfigFile('server_cert.pem'),
      key: readConfigFile('server_key.pem'),
      rejectUnauthorized: false,
      requestCert: true,
    }

    const httpsServer = https.createServer(httpsOpts, app)

    httpsServer.listen(env.port, () => {
      onServerStart()
    })
  }
  else {
    app.listen(env.port, () => {
      onServerStart()
    })
  }
}

startServer()
