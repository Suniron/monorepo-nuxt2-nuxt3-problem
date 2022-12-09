/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild')

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/app.js', 'src/prepare.js', 'src/import_demo.js'],
    external: ['./node_modules/*'],

    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

    // Reduce size in production:
    minify: process.env.NODE_ENV === 'production',
    outdir: 'out',
    platform: 'node',
    target: 'node16.16',
  })
  .then((result: any) => console.log('Files built with success:', result))
  .catch(() => process.exit(1))
