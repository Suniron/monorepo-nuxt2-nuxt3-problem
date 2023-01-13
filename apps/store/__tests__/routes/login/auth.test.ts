import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
import { fakeUserInDb, mockLoggedAsFullyConnectedUser, mockLoggedAsUser } from '../../utils/mockAuth'
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../src/config/env'

describe('POST /login/password', () => {
  it('should return a 401 when a user attempt to log it with a bad username', async () => {
    // Mock no user found
    prismaMock.user.findFirst.mockResolvedValue(null)

    const response = await request(app).post('/login/password').send({
      password: 'goodPassword',
      username: 'badUserName',
    })

    expect(response.status).toBe(401)
  })

  it('should return a 401  when a user attempt to log it with correct username but wrong password', async () => {
    // Mock user found
    prismaMock.user.findFirst.mockResolvedValue(fakeUserInDb)

    const response = await request(app).post('/login/password').send({
      password: 'badPassword',
      username: 'username',
    })
    expect(response.status).toBe(401)
  })

  it('when a user attempt to log it with correct username and correct password', async () => {
    const { user } = mockLoggedAsUser()

    const response = await request(app)
      .post('/login/password')
      .send({
        password: 'P@ssw0rd',
        username: user.username,
      })
      .expect(201)

    expect(response).toEqual(expect.not.objectContaining(user))
    expect(response.body.is2faInitialized).toBe(false)
  })
})

describe('POST /refresh-token', () => {
  it('should return a 401 with no refresh token in cookies', async () => {
    const response = await request(app).post('/refresh-token')
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/refresh token not found/)
  })

  it('should return a 401 with bad formatted refresh token in cookies', async () => {
    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=badFormattedToken`])
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/token malformed/)
  })

  it('should return 401 with good refresh token format in cookies but not exists in database', async () => {
    // Mock no corresponding refresh token found
    prismaMock.user_session.findUnique.mockResolvedValue(null)

    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhM2YzMGQ4LWE4ZmItNGY5My1iZTE0LTViYTU1ZTVhNGJkYyIsInR5cCI6InJlZnJlc2giLCJpYXQiOjE2NzM2MTU3NTUsImV4cCI6MTY4MTM5MTc1NSwiYXVkIjoiaHR0cHM6Ly94cmF0b3IuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdG9yZS54cmF0b3IuY29tIn0._fJFCQnUDgTi8Zn_9j3Ues0NpRJ_DnJo2VB1weGa7M4rl2m8eUU1wNwQciB0I8-pCNg57T_bITgdCEKN63RU9g`])
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/not found/)
  })

  it('should return 401 with revoked refresh token in cookies', async () => {
    const { refreshToken } = mockLoggedAsFullyConnectedUser()
    // Mock no corresponding refresh token found
    prismaMock.user_session.findUnique.mockResolvedValue(
      {
        created_at: new Date(),
        deleted_at: new Date(),
        fully_connected: false,
        id: '1',
        token: 'expiredToken',
        type: 'refresh',
        user_id: '1',
      },
    )

    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/revoked/)
  })

  it('should return 401 with expired refresh token in cookies', async () => {
    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOjEsImVtYWlsIjoiZXRpZW5uZUB4LXJhdG9yLmNvbSIsImZpcnN0TmFtZSI6IkV0aWVubmUiLCJpZCI6IjFhM2YzMGQ4LWE4ZmItNGY5My1iZTE0LTViYTU1ZTVhNGJkYyIsImxhc3ROYW1lIjoiQmxhbmMiLCJyb2xlcyI6WyJhZG1pbiJdLCJ1c2VybmFtZSI6ImV0aWVubmUiLCJjb21wYW55TmFtZSI6IkNPUkVYQUxZUyIsImZ1bGx5Q29ubmVjdGVkIjpmYWxzZSwiaWF0IjoxNjczNjE3OTQyLCJleHAiOjE2NzM2MTc5NTIsImF1ZCI6Imh0dHBzOi8veHJhdG9yLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RvcmUueHJhdG9yLmNvbSJ9.LAARYKMW93M0aL8PBfh-YrvhxZnhZ499TGnjYywnuU4`])
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/expired/)
  })

  it('should return 401 with good refresh token format in cookies but corresponding to an access token in database', async () => {
    // Mock corresponding to an access token
    prismaMock.user_session.findUnique.mockResolvedValue(
      {
        created_at: new Date(),
        deleted_at: null,
        fully_connected: false,
        id: '1',
        token: 'expiredToken',
        type: 'access',
        user_id: '1',
      },
    )

    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhM2YzMGQ4LWE4ZmItNGY5My1iZTE0LTViYTU1ZTVhNGJkYyIsInR5cCI6InJlZnJlc2giLCJpYXQiOjE2NzM2MTU3NTUsImV4cCI6MTY4MTM5MTc1NSwiYXVkIjoiaHR0cHM6Ly94cmF0b3IuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdG9yZS54cmF0b3IuY29tIn0._fJFCQnUDgTi8Zn_9j3Ues0NpRJ_DnJo2VB1weGa7M4rl2m8eUU1wNwQciB0I8-pCNg57T_bITgdCEKN63RU9g`])
    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/is not a refresh token/)
  })

  it('should return 201 with tokens and not fully connected refresh token', async () => {
    const { refreshToken, accessToken, user } = mockLoggedAsUser({ id: 'goodUserId' })

    // Mock corresponding to an access token
    prismaMock.user_session.findUnique.mockResolvedValue(
      {
        created_at: new Date(),
        deleted_at: null,
        fully_connected: false,
        id: '1',
        token: refreshToken,
        type: 'refresh',
        user_id: user.id,
      },
    )

    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])

    expect(response.headers['set-cookie'][0]).toMatch(`rt=${refreshToken}`)
    expect(response.status).toBe(201)
    expect(response.body.accessToken).toBe(accessToken)
    expect(response.body.user.fullyConnected).toBe(false)
  })

  it('should return 201 with tokens and fully connected refresh token', async () => {
    const { refreshToken, accessToken, user } = mockLoggedAsFullyConnectedUser({ id: 'goodUserId' })

    // Mock corresponding to an access token
    prismaMock.user_session.findUnique.mockResolvedValue(
      {
        created_at: new Date(),
        deleted_at: null,
        fully_connected: true,
        id: '1',
        token: refreshToken,
        type: 'refresh',
        user_id: user.id,
      },
    )

    const response = await request(app).post('/refresh-token').set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`])

    expect(response.headers['set-cookie'][0]).toMatch(`rt=${refreshToken}`)
    expect(response.status).toBe(201)
    expect(response.body.accessToken).toBe(accessToken)
    expect(response.body.user.fullyConnected).toBe(true)
  })
})

describe('/reset-password', () => {
  it(' POST / with correct email should return 200', async () => {
    const response = await request(app)
      .post('/reset-password')
      .send({
        username: 'test@x-rator.com',
      })
    expect(response.statusCode).toBe(200)
  })
  it(' POST / without email should return 401', async () => {
    const response = await request(app)
      .post('/reset-password')
    expect(response.statusCode).toBe(401)
  })

  it(' PATCH / should return 200', async () => {
    // const { accessToken } = mockLoggedAsFullyConnectedUser()

    mockKnexWithFinalValue([
      { id: 'bidon', reset_token: 'bidon', token_expires_at: 'bidon' },
    ])

    const result = await request(app).patch('/reset-password').send({
      password: 'changedP@ssw0rd',
      token: 'bidon',
    })
    expect(result.statusCode).toBe(200)
  })

  it(' PATCH / without email and token should return 401', async () => {
    const response = await request(app)
      .patch('/reset-password')
    expect(response.statusCode).toBe(401)
  })
})
