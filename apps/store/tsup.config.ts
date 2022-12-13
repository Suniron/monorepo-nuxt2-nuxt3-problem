import fs from 'fs'
import { defineConfig } from 'tsup'

const isDev = process.env.NODE_ENV === 'development'

const onSuccess = async () => {
  fs.copyFile('./api.yml', './dist/api.yml', () => {})
}

export default defineConfig(() => ({
  bundle: true,
  clean: true,
  entry: ['src', 'prisma/**/*.ts', 'migrations/**/*.ts', 'seeds/**/*.ts'],
  format: ['cjs'],
  onSuccess,

  platform: 'node',

  // == DEV CONF ==
  sourcemap: isDev,
  target: 'esnext',
  watch: isDev,
}))
