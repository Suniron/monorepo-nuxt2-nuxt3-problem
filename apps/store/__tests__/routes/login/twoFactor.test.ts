import request from 'supertest'
import { prismaMock } from '../../mockPrisma'

import app from '../../utils/fakeApp'
import { fakeUserInDb, mockLoggedAsUser } from '../../utils/mockAuth'

describe('POST /2fa/setup', () => {
  it('should return a 401 if fetched without auth', async () => {
    const response = await request(app).get('/2fa/setup')

    expect(response.status).toBe(401)
  })

  it('should return a 400 if fetched by a user who already have 2fa initialized', async () => {
    const { token } = mockLoggedAsUser()

    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_secret: 'myTwoFactor' },
    )

    const response = await request(app)
      .get('/2fa/setup')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })

  // it('should return a 401  when a user attempt to log it with correct username but wrong password', async () => {
  //   const customLogin = getNonAdminUser()
  //   // Mock user found
  //   prismaMock.user.findFirst.mockResolvedValue(fakeUserInDb)

  //   const response = await request(app).post('/login/password').send({
  //     password: 'badPassword',
  //     username: customLogin.username,
  //   })
  //   expect(response.status).toBe(401)
  // })

  // it('when a user attempt to log it with correct username and correct password', async () => {
  //   const loggedUser = mockLoggedAsUser()

  //   const response = await request(app)
  //     .post('/login/password')
  //     .send({
  //       password: 'P@ssw0rd',
  //       username: loggedUser.username,
  //     })
  //     .expect(201)

  //   expect(response).toEqual(expect.not.objectContaining(loggedUser))
  //   expect(response.body.is2faInitialized).toBe(false)
  // })
})
