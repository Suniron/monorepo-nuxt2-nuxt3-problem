// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import { prismaMock } from '../mockPrisma'
import app from '../utils/fakeApp'

describe('/files/:id', () => {
  describe('GET/', () => {
    it('should return a model error if Prisma crash', async () => {
      // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.store.findFirst.mockRejectedValue(new Error('Prisma error'))

      const response = await request(app)
        .patch('/company')
        .set('Authorization', `Bearer fake@token`)
      expect(response.status).toBe(500)
    })
  })
})
