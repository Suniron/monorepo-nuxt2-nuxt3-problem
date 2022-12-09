/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')

const path = require('path')
const esbuild = require('esbuild')

const SEEDS_FOLDER = './seeds'

const migrationFiles = fs
  .readdirSync(SEEDS_FOLDER)
  // Filter only .js files
  .filter((file: any) => path.extname(file) === '.js')
  // Build file path
  .map((file: any) => path.join(SEEDS_FOLDER, file))

esbuild
  .build({
    bundle: true,
    entryPoints: migrationFiles,
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // Reduce size in production:
    minify: process.env.NODE_ENV === 'production',

    outdir: 'out/seeds',
    platform: 'node',
    target: 'node16.16',
  })
  .then((result: any) => console.log('Migration files built with success: ', result))
  .catch(() => process.exit(1))
