import request from 'supertest'
import { prismaMock } from '../../mockPrisma'

import app from '../../utils/fakeApp'
import { mockKnexWithFinalValue, mockVerifyToken } from '../../mocks'
import { generateUser, getNonAdminUser } from '../../utils'
import { fakeUserInDb, mockLoggedAsUser } from '../../utils/mockAuth'

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
    const customLogin = getNonAdminUser()
    // Mock user found
    prismaMock.user.findFirst.mockResolvedValue(fakeUserInDb)

    const response = await request(app).post('/login/password').send({
      password: 'badPassword',
      username: customLogin.username,
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
  it('when a user attempt to refresh their token', async () => {
    mockVerifyToken(generateUser())

    prismaMock.user_session.findFirst.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      id: 'userSessionId',
      token: 'token',
      type: 'refresh',
      user_id: 'userId',
    })

    const mockedAccessToken = 'goodAccessToken'
    const mockedUser = {
      companyId: 'user.company_id',
      companyName: 'user.company_name',
      email: 'user.email',
      firstName: 'user.first_name',
      groups: 'user.groups',
      id: 'userId',
      lastName: 'user.last_name',
      roles: 'user.roles',
      username: 'user.username',
    }

    prismaMock.$transaction.mockResolvedValue({
      accessToken: mockedAccessToken,
      user: mockedUser,
    })
    mockKnexWithFinalValue([generateLogin()])

    const req = await request(app)
      .post('/refresh-token')
      .set('Cookie', ['rt=SomeRandomRefreshToken'])
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(201)

    const { accessToken, user } = req.body
    expect(accessToken).toBe(mockedAccessToken)
    expect(user).toEqual(mockedUser)
  })
  it('when a user attempt to refresh their token without a refresh token', () => {
    return request(app)
      .post('/refresh-token')
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(401)
  })
})

describe('/reset-password', () => {
  it(' POST / with correct email should return 200', () => {
    return request(app)
      .post('/reset-password')
      .send({
        username: 'test@x-rator.com',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(200)
      })
  })
  it(' POST / without email should return 401', () => {
    return request(app)
      .post('/reset-password')
      .then((response: any) => {
        expect(response.statusCode).toBe(401)
      })
  })
  it(' PATCH / should return 200', async () => {
    mockKnexWithFinalValue([
      { id: 'bidon', reset_token: 'bidon', token_expires_at: 'bidon' },
    ])
    const result = await request(app).patch('/reset-password').send({
      password: 'ChangementP@ssw0rd',
      token: 'zezaedaezdzaeda',
    })
    expect(result.statusCode).toBe(200)
  })
  it(' PATCH / without email and token should return 401', () => {
    return request(app)
      .patch('/reset-password')
      .then((response: any) => {
        expect(response.statusCode).toBe(401)
      })
  })
})
