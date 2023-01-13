import request from 'supertest'
import { prismaMock } from '../mockPrisma'
import app from '../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser } from '../utils/mockAuth'

describe('GET /files/:id', () => {
  let token = ''
  beforeAll(() => {
    token = mockLoggedAsFullyConnectedUser().accessToken
  })

  it('should return a model error if Prisma crash', async () => {
    prismaMock.store.findFirst.mockRejectedValue(new Error('Prisma error'))

    const response = await request(app)
      .patch('/company')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(500)
  })
})
