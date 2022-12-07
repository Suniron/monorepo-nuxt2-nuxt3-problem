/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild')


esbuild
  .build({
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    entryPoints: ['src/app.js', 'src/prepare.js', 'src/import_demo.js'],
    outdir: 'out',
    bundle: true,
    // Reduce size in production:
    minify: process.env.NODE_ENV === 'production',
    platform: 'node',
    target: 'node16.16',
    external: [
      './node_modules/*',
    ]
  })
  .then((result) => console.log('Files built with success:', result))
  .catch(() => process.exit(1))
