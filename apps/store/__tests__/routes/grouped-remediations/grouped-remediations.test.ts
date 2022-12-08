// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/grouped-r... Remove this comment to see the full error message
import groupedRemediations from '../../example-values/grouped-remediations.json'
import app from '../../utils/fakeApp'

describe('/remediations/grouped', () => {
  it('GET /remediations/grouped should return status 200 and list of priorities', async () => {
    mockKnexWithFinalValue(groupedRemediations.input)
    const result = await request(app)
      .get('/remediations/grouped')
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(result.body).toStrictEqual({ data: groupedRemediations.output })
  })
})
