import { MODEL_ERROR, VALIDATION_ERROR } from '../../src/common/constants'
import { saveTokens } from '../../src/models/auth/tokens'
import { prismaMock } from '../mockPrisma'

describe('saveTokens', () => {
  it('should throw an error on Prisma crash', async () => {
    prismaMock.user_session.createMany.mockRejectedValue(new Error('Prisma error'))

    expect((await saveTokens('userId', [{ token: 'goodToken', tokenType: 'access' }]))?.error).toBe(MODEL_ERROR)
  })

  it('should return validation error if token list is empty', async () => {
    expect((await saveTokens('userId', []))?.error).toBe(VALIDATION_ERROR)
  })

  it('should return validation error if token list contains more than elements', async () => {
    expect((await saveTokens('userId', [{ token: 'goodToken', tokenType: 'access' }, { token: 'goodToken2', tokenType: 'refresh' }, { token: 'goodToken3', tokenType: 'access' }]))?.error).toBe(VALIDATION_ERROR)
  })

  it('should return validation error if two token have the same type', async () => {
    expect((await saveTokens('userId', [{ token: 'goodToken', tokenType: 'access' }, { token: 'goodToken2', tokenType: 'access' }]))?.error).toBe(VALIDATION_ERROR)
  })
})
