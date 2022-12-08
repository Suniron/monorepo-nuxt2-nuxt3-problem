// @ts-check
import request from 'supertest'
import { prismaMock } from '../mockPrisma'
import app from '../utils/fakeApp'

describe('/files/:id', () => {
  describe('GET/', () => {
    it('should return a model error if Prisma crash', async () => {
      prismaMock.store.findFirst.mockRejectedValue(new Error('Prisma error'))

      const response = await request(app)
        .patch('/company')
        .set('Authorization', `Bearer fake@token`)
      expect(response.status).toBe(500)
    })
  })
})
