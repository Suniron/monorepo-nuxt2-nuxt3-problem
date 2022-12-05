// @ts-check
import request from 'supertest'
import csv from 'csvtojson'
import { prismaMock } from '../mockPrisma'
import app from '../utils/fakeApp'

let storeFiles = []

beforeAll(async () => {
  // Get datas:
  storeFiles = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/store.csv')
})

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
