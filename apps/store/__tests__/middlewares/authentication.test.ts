import request from 'supertest'
import app from '../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser, mockLoggedAsUser } from '../utils/mockAuth'

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

  it('should return 401 with a malformed token', async () => {
    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', 'Bearer badToken')

    expect(response.status).toBe(401)
  })

  it('should return 401 with wrong token', async () => {
    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbWFpbCI6ImNyeEFkbWluQGNvcmV4YWx5cy5jb20iLCJmaXJzdF9uYW1lIjoiU3VwZXIiLCJpZCI6IjMxZjBiYmE5LTIwNWItNDk1Ni05MDc5LWQyNjliNTA0YzQxNiIsImxhc3RfbmFtZSI6IkFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwidXNlcm5hbWUiOiJhZG1pbiIsImZ1bGx5Q29ubmVjdGVkIjpmYWxzZSwiaWF0IjoxNjczNDQ3NDExLCJleHAiOjE2NzM0NDkyMTEsImF1ZCI6Imh0dHBzOi8veHJhdG9yLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RvcmUueHJhdG9yLmNvbSJ9.crVriW4rEd97D0MO0HJDITnarvQGJdWGoaYASfvruY0')

    expect(response.status).toBe(401)
  })

  it('should return 201 if good token', async () => {
    const { accessToken: token } = mockLoggedAsUser()

    const response = await request(app)
      .get('/is-authorized/light')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
  })
})

describe('strongAuthenticationVerify', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/is-authorized')

    expect(response.status).toBe(401)
  })

  it('should return 401 with bad bearer structure', async () => {
    const response = await request(app)
      .get('/is-authorized')
      .set('Authorization', 'badBearerToken')

    expect(response.status).toBe(401)
  })

  it('should return 401 with wrong token', async () => {
    const response = await request(app)
      .get('/is-authorized')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoxLCJlbWFpbCI6ImNyeEFkbWluQGNvcmV4YWx5cy5jb20iLCJmaXJzdF9uYW1lIjoiU3VwZXIiLCJpZCI6IjMxZjBiYmE5LTIwNWItNDk1Ni05MDc5LWQyNjliNTA0YzQxNiIsImxhc3RfbmFtZSI6IkFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwidXNlcm5hbWUiOiJhZG1pbiIsImZ1bGx5Q29ubmVjdGVkIjpmYWxzZSwiaWF0IjoxNjczNDQ3NDExLCJleHAiOjE2NzM0NDkyMTEsImF1ZCI6Imh0dHBzOi8veHJhdG9yLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RvcmUueHJhdG9yLmNvbSJ9.crVriW4rEd97D0MO0HJDITnarvQGJdWGoaYASfvruY0')

    expect(response.status).toBe(401)
  })

  it('should return 201 if good token', async () => {
    const { accessToken: token } = mockLoggedAsFullyConnectedUser()

    const response = await request(app)
      .get('/is-authorized')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
  })
})
