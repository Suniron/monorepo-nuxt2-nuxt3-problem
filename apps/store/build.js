/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild')

esbuild
  .build({
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    entryPoints: ['src/app.js', 'src/prepare.js', 'src/import_demo.js'],
    bundle: true,
    outdir: 'out',
    // Reduce size in production:
    minify: process.env.NODE_ENV === 'production',
    platform: 'node',
    target: 'node16.16',
    external: [
      // To solve a knex problem, mark as externals some libs
      // TODO: remove when knex => Prisma migration is done
      'sqlite3',
      'better-sqlite3',
      'mysql',
      'mysql2',
      'tedious',
      'oracledb',
      'pg-query-stream',
      'oracledb',
      'pg-native',
    ],
  })
  .then((result) => console.log('Files built with success:', result))
  .catch(() => process.exit(1))
