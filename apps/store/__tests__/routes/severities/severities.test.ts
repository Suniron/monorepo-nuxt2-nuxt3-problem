import request from 'supertest'
import type { severity as Severity } from '@prisma/client'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'

let EXISTING_SEVERITY_ID = 0
let NOTEXISTING_SEVERITY_ID = 0
const severities: Severity[] = [
  { id: 1, name: 'C1' },
  { id: 2, name: 'C2' },
  { id: 3, name: 'C3' },
  { id: 4, name: 'C4' },
  { id: 5, name: 'C5' },
]

beforeAll(async () => {
  // Make ids:
  EXISTING_SEVERITY_ID = severities[0].id
  NOTEXISTING_SEVERITY_ID
    = Math.max(0, ...severities.map(severity => Number(severity.id))) + 1 // max id + 1
})

describe('/severities/', () => {
  describe('GET / without auth token', () => {
    it('should return 401 ', async () => {
      const response = await request(app).get('/severities/')

      expect(response.status).toBe(401)
    })
  })

  describe('GET / with auth token', () => {
    let token = ''
    beforeAll(() => {
      token = mockLoggedAsFullyConnectedUser().token
    })

    describe('with knex error', () => {
      it('should return 500 and content should be Content-Type json', async () => {
        mockKnexWithFinalValue(undefined, true)

        const response = await request(app)
          .get('/severities/')
          .set('Authorization', `Bearer ${token}`)

        expect(response.type).toBe('application/json')
        expect(response.status).toBe(500)
      })
    })

    describe('with good data', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue(severities)
        const response = await request(app)
          .get('/severities/')
          .set('Authorization', `Bearer ${token}`)

        expect(response.type).toBe('application/json')
      })

      it('should be status 200', async () => {
        const user = mockLoggedAsFullyConnectedUser()
        mockKnexWithFinalValue(severities)
        const response = await request(app)
          .get('/severities/')
          .set('Authorization', `Bearer ${user.token}`)

        expect(response.status).toBe(200)
      })

      it('should found data', async () => {
        mockKnexWithFinalValue(severities)
        const response = await request(app)
          .get('/severities/')
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).toEqual(severities)
      })
    })
  })
})

describe('GET / /severities/:id', () => {
  describe('without auth', () => {
    it('should return 401 ', async () => {
      const response = await request(app).get(
        `/severities/${EXISTING_SEVERITY_ID}`,
      )

      expect(response.status).toBe(401)
    })
  })

  describe('fully connected as user', () => {
    let token = ''
    beforeAll(() => {
      token = mockLoggedAsFullyConnectedUser().token
    })

    describe('with bad id', () => {
      it('should be 400', async () => {
        mockKnexWithFinalValue(severities)
        const response = await request(app)
          .get('/severities/bad_id')
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
      })
    })

    describe('with knex error', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue(undefined, true)

        const response = await request(app)
          .get(`/severities/${EXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.type).toBe('application/json')
      })

      it('should be status 500', async () => {
        mockKnexWithFinalValue(undefined, true)

        const response = await request(app)
          .get(`/severities/${EXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(500)
      })
    })

    describe('with good id', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue([severities[0]])
        const response = await request(app)
          .get(`/severities/${EXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.type).toBe('application/json')
      })

      it('should be status 200', async () => {
        mockKnexWithFinalValue([severities[0]])
        const response = await request(app)
          .get(`/severities/${EXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
      })

      it('should found data', async () => {
        mockKnexWithFinalValue([severities[0]])
        const response = await request(app)
          .get(`/severities/${severities[0].id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.body).toEqual(severities[0])
      })
    })

    describe('with not existing id', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue([])
        const response = await request(app)
          .get(`/severities/${NOTEXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.type).toBe('application/json')
      })

      it('should be status 404', async () => {
        mockKnexWithFinalValue([])
        const response = await request(app)
          .get(`/severities/${NOTEXISTING_SEVERITY_ID}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
      })
    })
  })
})
