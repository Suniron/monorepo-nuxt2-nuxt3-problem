import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import { mockLoggedAsFullyConnectedAdmin, mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'
import app from '../../utils/fakeApp'

import probes from '../../example-values/probes.json'

describe('PATCH /probes/:id', () => {
  describe('as fully connected user', () => {
    let token = ''
    beforeAll(() => {
      token = mockLoggedAsFullyConnectedUser().accessToken
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(body)
      expect(response.status).toBe(400)
    })
  })

  describe('as fully connected admin', () => {
    let token = ''
    beforeAll(() => {
      token = mockLoggedAsFullyConnectedAdmin().accessToken
    })

    it('should return 204 if the request is a success', async () => {
    // this is the data used for the test, this is the only thing you should modify
      const id = 1
      const body = { name: 'testProbeName' }

      const result = probes.find((e: any) => e.id === id)

      prismaMock.probe.findFirst.mockResolvedValue(result)

      prismaMock.probe.update.mockResolvedValue({ ...result, name: body.name })
      const response = await request(app)
        .patch(`/probes/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body)
      // .expect('Content-Type', /json/)
      expect(response.status).toBe(204)
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
        .set('Authorization', `Bearer ${token}`)
        .send(body)
      expect(response.status).toBe(404)
    })
  })
})
