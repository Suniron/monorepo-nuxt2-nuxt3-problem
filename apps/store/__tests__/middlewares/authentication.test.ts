import request from 'supertest'
import { prismaMock } from '../mockPrisma'
import { generateJWTToken } from '../../src/common/auth/jwt'
import app from '../utils/fakeApp'

describe('lightAuthenticationVerify', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/is-authorized/light')

    expect(response.status).toBe(401)
  })

  it('should return 401 with bad bearer structure', async () => {
    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', 'badBearerToken')

    expect(response.status).toBe(401)
  })

  it('should return 401 with bad token', async () => {
    prismaMock.user_session.findUnique.mockResolvedValue(null)

    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', 'Bearer badToken')

    expect(response.status).toBe(401)
  })

  it('should return 201 if good token', async () => {
    const accessToken = generateJWTToken('access', {})

    prismaMock.user_session.findUnique.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected_at: null,
      id: 'goodTokenId',
      token: accessToken,
      type: 'access',
      user_id: 'userId',
    })

    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(201)
  })
})
