// @ts-check
import { TextEncoder } from 'util'
global.TextEncoder = TextEncoder

import { mockVerifyToken } from '../mocks'
import { generateUser } from '.'

const customUser = generateUser({
  firstName: 'Etienne-test',
  lastName: 'Blanc-test',
})

/**
 * Theese actions will be executed **before** each tests
 */
beforeAll(() => {
  mockVerifyToken(customUser)
})

/**
 * Theese actions will be executed **before** each tests
 */
afterAll(() => {
  // TODO
})
