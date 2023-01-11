import { prismaMock } from '../mockPrisma'
import { getUserByIdRequest } from '../../src/requests/users'
import { fakeUserInDb } from '../utils/mockAuth'

describe('getUserByIdRequest', () => {
  it('should found the user', async () => {
    const user = fakeUserInDb
    prismaMock.user.findUnique.mockResolvedValue(user)

    expect((await getUserByIdRequest(prismaMock, user.id))).toEqual(user)
  })
})
