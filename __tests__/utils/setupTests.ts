// Load .env file
import { config } from 'dotenv'
config()

/**
 * Theese actions will be executed **before** each tests.
 *
 * It's used only when launch from vscode extension
 */
beforeAll(() => {
  jest.setTimeout(60 * 5 * 1000)
})
