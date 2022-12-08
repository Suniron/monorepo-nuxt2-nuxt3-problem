/* eslint-disable @typescript-eslint/no-var-requires */

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'esbuild'.
const esbuild = require('esbuild')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path')

const SEEDS_FOLDER = './seeds'

const migrationFiles = fs
  .readdirSync(SEEDS_FOLDER)
  // Filter only .js files
  .filter((file: any) => path.extname(file) === '.js')
  // Build file path
  .map((file: any) => path.join(SEEDS_FOLDER, file))

esbuild
  .build({
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    entryPoints: migrationFiles,
    bundle: true,
    outdir: 'out/seeds',
    // Reduce size in production:
    minify: process.env.NODE_ENV === 'production',
    platform: 'node',
    target: 'node16.16',
  })
  .then((result: any) => console.log('Migration files built with success: ', result))
  .catch(() => process.exit(1))
