import request from 'supertest'
import { prismaMock } from '../../mockPrisma'

import app from '../../utils/fakeApp'
import { mockKnexWithFinalValue, mockVerifyToken } from '../../mocks'
import { generateLogin, generateUser } from '../../utils/index.js'

describe('POST /login', () => {
  it('when a user attemps to log it with incorrect credentials', async () => {
    const Knex = mockKnexWithFinalValue([null])

    const response = await request(app).post('/login').send({
      password: 'password',
      username: 'username',
    })

    expect(Knex.select).toBeCalledWith(
      'usr.id',
      'usr.first_name',
      'usr.last_name',
      'usr.username',
      'usr.password',
      'usr.salt',
      'usr.email',
      'usr.company_id',
      'cmp.name as company_name',
      'usr.roles',
    )
    expect(Knex.from).toBeCalledWith('user as usr')
    expect(Knex.innerJoin).toBeCalledWith(
      'company as cmp',
      'usr.company_id',
      'cmp.id',
    )
    expect(Knex.where).toBeCalledTimes(2)
    expect(Knex.where).toBeCalledWith(expect.any(Function))
    expect(Knex.where).toBeCalledWith('usr.username', 'username')
    expect(Knex.orWhere).toBeCalledWith('usr.email', 'username')
    expect(response.status).toBe(404)
  })

  it('when a user attemps to log it with correct username but wrong password', async () => {
    const customLogin = generateLogin({ firstName: 'David', lastName: 'B' })
    mockKnexWithFinalValue([customLogin])

    const response = await request(app).post('/login').send({
      password: 'test',
      username: customLogin.username,
    })
    expect(response.status).toBe(401)
  })

  it('when a user attemps to log it with correct username and correct password', async () => {
    const customLogin = generateLogin({ firstName: 'David', lastName: 'B' })
    const Knex = mockKnexWithFinalValue([customLogin])

    const response = await request(app)
      .post('/login')
      .send({
        password: 'UnitTestCrypt@1',
        username: customLogin.username,
      })
      .expect(201)

    expect(Knex.where).toHaveBeenNthCalledWith(1, expect.any(Function))
    expect(Knex.where).toHaveBeenNthCalledWith(
      2,
      'usr.username',
      customLogin.username,
    )
    expect(Knex.transaction).not.toBeUndefined()
    expect(response).toEqual(expect.not.objectContaining(customLogin))
  })
})

describe('POST /refresh-token', () => {
  it('when a user attemps to refresh their token', async () => {
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
  it('when a user attemps to refresh their token without a refresh token', () => {
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
