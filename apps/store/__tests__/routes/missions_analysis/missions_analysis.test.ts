// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'

describe('/missions_analysis/:id', () => {
  it('GET/ with bad datas should be status 500', () => {
    mockKnexWithFinalValue(['missions_analysis_id_bad']) // bad datas
    return request(app)
      .get('/missions_analysis/4')
      .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      .expect('Content-Type', /json/)
      .expect(500);
  })
})
