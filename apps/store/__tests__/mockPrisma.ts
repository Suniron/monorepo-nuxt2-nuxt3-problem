import type { PrismaClient } from '@prisma/client'
import type { DeepMockProxy } from 'jest-mock-extended'
import { mockDeep, mockReset } from 'jest-mock-extended'
import prisma from '../src/prismaClient'

/**
 * **VERY IMPORTANT**: this mock must be imported **before** files to test.
 * Otherwise, the mock will not be used and requests are directly applied in database.
 */
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

jest.mock('../src/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),

}))

beforeEach(() => {
  mockReset(prismaMock)
})
