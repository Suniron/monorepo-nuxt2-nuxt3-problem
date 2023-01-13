import 'module-alias/register'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { log } from './lib/logger'
import initServer from '@/server'
import env from '@/config/env'

async function startServer() {
  const app = await initServer()

  if (env.nodeEnv.isProduction && !env.httpsEnabled) {
    log.warn(
      'Building for production without certificate. Please provide both `server_cert.pem` and `server_key.pem` files.',
    )
  }
  if (env.nodeEnv.isProduction && env.httpsEnabled) {
    const readConfigFile = filename =>
      fs.readFileSync(path.resolve(__dirname, '../../../secrets/', filename))
    const httpsOpts = {
      cert: readConfigFile('server_cert.pem'),
      key: readConfigFile('server_key.pem'),
    }

    const httpsServer = https.createServer(httpsOpts, app)

    httpsServer.listen(env.port, () => {
      log.info(`HTTPS Server started on port ${env.port}`)
    })
  }
  else {
    app.listen(env.port, () => {
      log.info(`HTTP Server started on port ${env.port}`)
    })
  }
}

startServer()
