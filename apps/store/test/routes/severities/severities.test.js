// @ts-check
import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'

/**
 * @type number
 */
let EXISTING_SEVERITY_ID = 0
/**
 * @type number
 */
let NOTEXISTING_SEVERITY_ID = 0
/**
 * @type {import('@/types/severity').Severity[]}
 */
let severities = []

beforeAll(async () => {
  // Get datas:
  severities = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/severity.csv')

  // Make ids:
  EXISTING_SEVERITY_ID = severities[0].id
  NOTEXISTING_SEVERITY_ID =
    Math.max(0, ...severities.map((severity) => Number(severity.id))) + 1 // max id + 1
})

describe('/severities/', () => {
  describe('GET / without auth token', () => {
    it('should return 401 ', async () => {
      const response = await request(app).get('/severities/')

      expect(response.status).toBe(401)
    })
  })

  describe('GET / with knex error', () => {
    it('should be Content-Type json', async () => {
      mockKnexWithFinalValue(undefined, true)

      const response = await request(app)
        .get('/severities/')
        .set('Authorization', `Bearer fake@token`)

      expect(response.type).toBe('application/json')
    })

    it('should be status 500', async () => {
      mockKnexWithFinalValue(undefined, true)

      const response = await request(app)
        .get('/severities/')
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(500)
    })
  })

  describe('GET / with good datas', () => {
    it('should be Content-Type json', async () => {
      mockKnexWithFinalValue(severities)
      const response = await request(app)
        .get('/severities/')
        .set('Authorization', `Bearer fake@token`)

      expect(response.type).toBe('application/json')
    })

    it('should be status 200', async () => {
      mockKnexWithFinalValue(severities)
      const response = await request(app)
        .get('/severities/')
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(200)
    })

    it('should found datas', async () => {
      mockKnexWithFinalValue(severities)
      const response = await request(app)
        .get('/severities/')
        .set('Authorization', `Bearer fake@token`)

      expect(response.body).toEqual(severities)
    })
  })
})

describe('/severities/:id', () => {
  describe('GET / without auth token', () => {
    it('should return 401 ', async () => {
      const response = await request(app).get(
        '/severities/' + EXISTING_SEVERITY_ID
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET / with bad id', () => {
    it('should be 400', async () => {
      mockKnexWithFinalValue(severities)
      const response = await request(app)
        .get('/severities/bad_id')
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(400)
    })
  })

  describe('GET / with knex error', () => {
    it('should be Content-Type json', async () => {
      mockKnexWithFinalValue(undefined, true)

      const response = await request(app)
        .get('/severities/' + EXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.type).toBe('application/json')
    })

    it('should be status 500', async () => {
      mockKnexWithFinalValue(undefined, true)

      const response = await request(app)
        .get('/severities/' + EXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(500)
    })
  })

  describe('GET / with good id', () => {
    it('should be Content-Type json', async () => {
      mockKnexWithFinalValue([severities[0]])
      const response = await request(app)
        .get('/severities/' + EXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.type).toBe('application/json')
    })

    it('should be status 200', async () => {
      mockKnexWithFinalValue([severities[0]])
      const response = await request(app)
        .get('/severities/' + EXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(200)
    })

    it('should found data', async () => {
      mockKnexWithFinalValue([severities[0]])
      const response = await request(app)
        .get('/severities/' + severities[0].id)
        .set('Authorization', `Bearer fake@token`)

      expect(response.body).toEqual(severities[0])
    })
  })

  describe('GET / with unexisting id', () => {
    it('should be Content-Type json', async () => {
      mockKnexWithFinalValue([])
      const response = await request(app)
        .get('/severities/' + NOTEXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.type).toBe('application/json')
    })

    it('should be status 404', async () => {
      mockKnexWithFinalValue([])
      const response = await request(app)
        .get('/severities/' + NOTEXISTING_SEVERITY_ID)
        .set('Authorization', `Bearer fake@token`)

      expect(response.status).toBe(404)
    })
  })
})
