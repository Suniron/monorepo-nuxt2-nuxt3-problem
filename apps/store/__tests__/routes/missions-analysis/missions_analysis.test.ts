import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'

describe('/missions_analysis/:id', () => {
  it('GET/ with bad data should be status 500', () => {
    const { token } = mockLoggedAsFullyConnectedUser()
    mockKnexWithFinalValue(['missions_analysis_id_bad']) // bad data
    return request(app)
      .get('/missions_analysis/4')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(500)
  })
})
