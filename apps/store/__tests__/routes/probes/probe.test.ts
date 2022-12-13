import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

import probes from '../../example-values/probes.json'
import { mockAdminUser } from '../../mocks'

describe('/probes/:id', () => {
  describe('patch /', () => {
    beforeAll(() => {
      mockAdminUser({ companyId: 1 })
    })
    it('should return 200 if the request is a success', async () => {
      // this is the data used for the test, this is the only thing you should modify
      const id = 1
      const body = { name: 'testProbeName' }

      const result = probes.find((e: any) => e.id === id)

      prismaMock.probe.findFirst.mockResolvedValue(result)

      prismaMock.probe.update.mockResolvedValue({ ...result, name: body.name })
      const response = await request(app)
        .patch(`/probes/${id}`)
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send(body)
      // .expect('Content-Type', /json/)
      expect(response.status).toBe(204)
    })
    it('should return 400 if there is no "name" in the body', async () => {
      // this is the data used for the test, this is the only thing you should modify
      const id = 2
      const body = {}

      const result = probes.find((e: any) => e.id === id)

      prismaMock.probe.findFirst.mockResolvedValue(result)

      prismaMock.probe.update.mockResolvedValue({ ...result, name: body.name })
      const response = await request(app)
        .patch(`/probes/${id}`)
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send(body)
      expect(response.status).toBe(400)
    })
    it('should return 400 if there is more than "name" in the body', async () => {
      // this is the data used for the test, this is the only thing you should modify
      const id = 2
      const body = { fakeProperty: 'fakeData', name: 'testProbeName' }

      const result = probes.find((e: any) => e.id === id)

      prismaMock.probe.findFirst.mockResolvedValue(result)

      prismaMock.probe.update.mockResolvedValue({ ...result, name: body.name })
      const response = await request(app)
        .patch(`/probes/${id}`)
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send(body)
      expect(response.status).toBe(400)
    })
    it('should return 404 not found if there is no probe existing with this id', async () => {
      // this is the data used for the test, this is the only thing you should modify
      const id = 10
      const body = { name: 'testProbeName' }

      const result = probes.find((e: any) => e.id === id)

      prismaMock.probe.findFirst.mockResolvedValue(result)

      prismaMock.probe.update.mockResolvedValue({ ...result, name: body.name })
      const response = await request(app)
        .patch(`/probes/${id}`)
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send(body)
      expect(response.status).toBe(404)
    })
  })
})
