// Load .env file
import { config } from 'dotenv'
config()
// import { TextEncoder } from 'util'

// import { mockVerifyToken } from '../mocks'
// import { generateUser } from '.'
// global.TextEncoder = TextEncoder

// const customUser = generateUser({
//   firstName: 'Etienne-test',
//   lastName: 'Blanc-test',
// })
/**
 * Theese actions will be executed **before** each tests
 */
beforeAll(() => {
  // jest.setTimeout(30000)
  // mockVerifyToken(customUser)
})

/**
 * Theese actions will be executed **before** each tests
 */
afterAll(() => {
  // TODO
})
