import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'

import groupedRemediations from '../../example-values/grouped-remediations.json'
import app from '../../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'

describe('/remediations/grouped', () => {
  it('GET /remediations/grouped should return status 200 and list of priorities', async () => {
    const { token } = mockLoggedAsFullyConnectedUser()
    mockKnexWithFinalValue(groupedRemediations.input)
    const result = await request(app)
      .get('/remediations/grouped')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(result.body).toStrictEqual({ data: groupedRemediations.output })
  })
})
