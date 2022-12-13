import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'

import ip from '../../example-values/ip.json'
import app from '../../utils/fakeApp'

describe('/ips/:id', () => {
  mockKnexWithFinalValue([ip])
  it('DELETE / should return 204 if we delete an asset', () => {
    return request(app)
      .delete('/ips/63')
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(204)
  })
  it('DELETE / should return 401 without bearer if we delete an asset', () => {
    return request(app).delete('/ips/63').expect(401)
  })

  mockKnexWithFinalValue([ip])
  it('UPDATE / should return 204 if we update an asset', () => {
    return request(app)
      .patch('/ips/63')
      .send({
        address: '10.254.1.12',
        iface: 'iface',
        mac: 'mac',
        mask: 'mask',
      })
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(204)
  })
  it('UPDATE / should return 401 without bearer if we update an asset', () => {
    return request(app).patch('/ips/63').expect(401)
  })
  it('UPDATE / should return 500 with bearer but without request.body if we update an asset', () => {
    return request(app)
      .patch('/ips/63')
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(400)
  })
  it('UPDATE / should return 500 with bearer but without fullfilled request.body if we update an asset', () => {
    return request(app)
      .patch('/ips/63')
      .send({
        address: '10.254.1.12',
        mac: 'mac',
        mask: 'mask',
      })
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(400)
  })
})

describe('/ips/:assetId', () => {
  mockKnexWithFinalValue([ip])
  it('CREATE / should return 201 if we create an ip', () => {
    return request(app)
      .post('/ips/8')
      .send({
        address: '10.254.1.12',
        iface: 'iface',
        mac: 'mac',
        mask: 'mask',
      })
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(201)
  })
  it('CREATE / should return 401 if we create an ip without bearer', () => {
    return request(app).post('/ips/8').expect(401)
  })
  it('CREATE / should return 400 with bearer but without request.body if we create an ip', () => {
    return request(app)
      .post('/ips/8')
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(400)
  })
  it('CREATE / should return 400 with bearer but without fullfilled request.body if we update an asset', () => {
    return request(app)
      .post('/ips/8')
      .send({
        address: '10.254.1.12',
        mac: 'mac',
        mask: 'mask',
      })
      .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      .expect(400)
  })
})