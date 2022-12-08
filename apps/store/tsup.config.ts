import { defineConfig } from 'tsup'
import fs from "fs"

const isDev = process.env.NODE_ENV === 'development'

const onSuccess = async () => {
    fs.copyFile('./api.yml', './dist/api.yml', (err) => console.error("Error copying api.yml", err))
}

export default defineConfig(() => ({
  bundle: true,
  clean: true,
  entry: ['src', 'prisma/**/*.ts', 'migrations/**/*.ts', 'seeds/**/*.ts'],
  format: ['cjs'],
  platform: 'node',
  // == DEV CONF ==
  sourcemap: isDev,

  target: 'esnext',
  watch: isDev,
  onSuccess
}))
