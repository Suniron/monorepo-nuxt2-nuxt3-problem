import { runSeeders } from './startSeed'
import { resetDatabase } from './truncateAllDatabase'

if (process.env.NODE_ENV !== 'development')
  throw new Error('This tool is for development environement only')

if (!process.env.POSTGRES_URI)
  throw new Error('\'POSTGRES_URI\' env var must be set')

resetDatabase().then(() => runSeeders())
