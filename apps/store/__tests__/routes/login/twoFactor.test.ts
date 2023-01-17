import request from 'supertest'
import { prismaMock } from '../../mockPrisma'

import app from '../../utils/fakeApp'
import { fakeUserInDb, mockLoggedAsUser } from '../../utils/mockAuth'

describe('GET /two-factor/setup', () => {
  it('should return a 401 if fetched without auth', async () => {
    const response = await request(app).get('/two-factor/setup')

    expect(response.status).toBe(401)
  })

  it('should return a 400 if fetched by a user who already have 2fa initialized', async () => {
    const { accessToken: token } = mockLoggedAsUser()

    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_confirmed_at: new Date(), two_factor_secret: 'myTwoFactor' },
    )

    const response = await request(app)
      .get('/two-factor/setup')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })

  it('should return a 200 with a token in body if 2fa not yet initialized', async () => {
    const { accessToken: token } = mockLoggedAsUser()

    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_secret: null },
    )

    // Mock init totp model
    prismaMock.user.findUnique.mockResolvedValue(fakeUserInDb)
    prismaMock.user.update.mockResolvedValue({ ...fakeUserInDb, two_factor_secret: 'newGeneratedSecret' })

    const response = await request(app)
      .get('/two-factor/setup')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('seed')
    expect(response.body).toHaveProperty('seedUrl')
  })

  it('should return a 200 with a token in body if 2fa not fully initialized (not confirmed by user)', async () => {
    const { accessToken: token } = mockLoggedAsUser()

    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_secret: null },
    )

    // Mock init totp model
    prismaMock.user.findUnique.mockResolvedValue(fakeUserInDb)
    prismaMock.user.update.mockResolvedValue({ ...fakeUserInDb, two_factor_secret: 'newGeneratedSecret' })

    const response = await request(app)
      .get('/two-factor/setup')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('seed')
    expect(response.body).toHaveProperty('seedUrl')
  })
})

describe('POST /login/totp', () => {
  it('should return a 401 if fetched without auth', async () => {
    const response = await request(app).post('/login/totp')

    expect(response.status).toBe(401)
  })

  it('should return a 401 if the user 2fa is not yet initialized', async () => {
    // TODO
    const response = await request(app).post('/login/totp')

    expect(response.status).toBe(401)
  })

  it('should return a 401 if the given token is wrong', async () => {
    // TODO
    const response = await request(app).post('/login/totp')

    expect(response.status).toBe(401)
  })

  it('should return a 200 if the given token is valid', async () => {
    // TODO
    const response = await request(app).post('/login/totp')

    expect(response.status).toBe(401)
  })

  // TODO: on success, should return a 200 + in body a new access token and user with "fullyConnected: true"
})