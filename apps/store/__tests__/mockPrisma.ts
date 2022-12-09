

/**
 * @typedef {import("@prisma/client").PrismaClient} PrismaClient
 */
import { mockDeep, mockReset } from 'jest-mock-extended'

import prisma from '../src/prismaClient'

jest.mock('../src/prismaClient', () => ({
  __esModule: true,
  /**
   * @type {import('jest-mock-extended').DeepMockProxy<PrismaClient>()}
   */
  default: mockDeep(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

/**
 * **VERY IMPORTANT**: this mock must be imported **before** files to test.
 * Otherwise, the mock will not be used and requests are directly applied in database.
 * @type {import('jest-mock-extended').DeepMockProxy<PrismaClient>}
 */
export const prismaMock = prisma
