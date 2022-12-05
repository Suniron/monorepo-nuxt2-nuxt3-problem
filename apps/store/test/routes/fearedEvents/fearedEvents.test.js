// @ts-check
import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'

/**
 * @type {import('@/types/fearedEvent').FearedEvent[]}
 */
let fearedEvents = []
/**
 * @type {import('@/types/severity').Severity[]}
 */
let severities = []

beforeAll(async () => {
  // Get datas:
  fearedEvents = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/feared_event.csv')

  severities = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/severity.csv')
})

describe('/feared-events/', () => {
  it('PATCH / should return 404 ', async () => {
    const response = await request(app)
      .patch('/feared-events/')
      .set('Authorization', `Bearer fake@token`)

    expect(response.status).toBe(404)
  })
})

describe('/feared-events/:id', () => {
  describe('PATCH /:id without auth token', () => {
    it('should return 401 ', async () => {
      const response = await request(app).patch('/feared-events/1')

      expect(response.status).toBe(401)
    })
  })

  describe('PATCH /:id with bad Feared Event id', () => {
    it('should be 400', async () => {
      const response = await request(app)
        .patch('/feared-events/bad_id')
        .send({ severityId: 1 }) // good severity id
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /:id without Severity id', () => {
    it('should be 400', async () => {
      const response = await request(app)
        .patch('/feared-events/1') // good Feared Event id
        .set('Authorization', `Bearer fake@token`)
      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /:id with bad Severity id (string instead of number)', () => {
    it('should be 400', async () => {
      const response = await request(app)
        .patch('/feared-events/1') // good Feared Event id
        .set('Authorization', `Bearer fake@token`)
        .send({ severityId: 'bad_severity_id' })
      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /:id with good Feared Event & Severity id', () => {
    it('should be 204', async () => {
      const fearedEventId = fearedEvents[0].id
      const severityId = severities[0].id

      mockKnexWithFinalValue([severities.find((s) => s.id === severityId)])
      mockKnexWithFinalValue([fearedEvents.find((s) => s.id === fearedEventId)])

      const response = await request(app)
        .patch('/feared-events/' + fearedEventId)
        .set('Authorization', `Bearer fake@token`)
        .send({ severityId })
      expect(response.status).toBe(204)
    })
  })
})
