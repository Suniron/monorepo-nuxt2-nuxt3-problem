// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import { mockKnexWithFinalValue } from '../../mocks'
import { prismaMock } from '../../mockPrisma'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/vulnerabi... Remove this comment to see the full error message
import { vulnerabilities } from '../../example-values/vulnerabilities_asset.json'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/assets.js... Remove this comment to see the full error message
import { assets, assetBelonging } from '../../example-values/assets.json'
import assetRisk from '../../example-values/asset-risk-scores'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/assets-pa... Remove this comment to see the full error message
import assetsPatch from '../../example-values/assets-patch.json'
import app from '../../utils/fakeApp'

describe('/assets', () => {
  it(' GET / should return 401 if we fetch without token', () => {
    return request(app).get('/assets').expect(401)
  })

  it(' GET / should return 200 if we fetch with token', () => {
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.user_group.findMany.mockResolvedValue([
      { group_id: 1, user_id: 'user id' },
    ])
    mockKnexWithFinalValue([assets])

    return request(app)
      .get('/assets')
      .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/);
  })
})

describe('/assets/:id', () => {
  it(' GET / should return 401 if we fetch without token', () => {
    return request(app).get('/assets').expect(401)
  })
  it(' GET / should return 200 if we fetch with token', () => {
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.user_group.findMany.mockResolvedValue([
      { group_id: 1, user_id: 'user id' },
    ])
    mockKnexWithFinalValue([assets])
    return request(app)
      .get('/assets/33')
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/);
  })
  it('PATCH / should return 204 if we update an asset', () => {
    mockKnexWithFinalValue([])
    return request(app)
      .patch('/assets/133')
      .send(assetsPatch)
      .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      .expect(204)
  })
  it('DELETE / should return 204 if we delete an asset', () => {
    mockKnexWithFinalValue([{ id: '63' }])
    return request(app)
      .delete('/assets/63')
      .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      .expect(204)
  })
})

describe('/assets/:id/ports', () => {
  it('GET/ should return status 200 and list of ports', () => {
    return request(app)
      .get('/assets/63/ports')
      .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
  })
})

describe('/assets/:id/vulnerabilities', () => {
  it('GET/ should return status 200 and list of vulnerabitilies', async () => {
    mockKnexWithFinalValue([vulnerabilities])
    return request(app)
      .get('/assets/33/vulnerabilities')
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/);
  })
})

describe('/assets/belonging', () => {
  it('GET /assets/belonging should return status 200 and list of assets and their children (BELONGS_TO relation type)', async () => {
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.user_group.findMany.mockResolvedValue([
      { group_id: 1, user_id: 'user id' },
    ])
    mockKnexWithFinalValue(assetBelonging.input)
    const result = await request(app)
      .get('/assets/belonging')
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(result.body).toEqual(assetBelonging.output)
  })
})

describe('/assets/:id/risk', () => {
  it('GET/assets/:id/risk should return status 200 and risk properties of the asset', async () => {
    const assetId = 11
    const risk = assetRisk.find((ast) => ast.asset_id === assetId) || null
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.v_asset_risk_scores.findFirst.mockResolvedValue(risk)
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.vulnerability_asset.findMany.mockResolvedValue([]) // TODO

    const result = await request(app)
      .get(`/assets/${assetId}/risk`)
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(200)
      .expect('Content-Type', /json/)
    expect(result.body).toHaveProperty('lastScanDate')
    expect(result.body).toHaveProperty('scores')
    expect(result.body.scores).toHaveProperty('inherentScore')
    expect(result.body.scores).toHaveProperty('inheritedScore')
    expect(result.body.scores).toHaveProperty('compoundScore')
    expect(result.body.scores.inherentScore).toEqual(risk?.inherent_score)
    expect(result.body.scores.inheritedScore).toEqual(risk?.inherited_score)
    expect(result.body.scores.compoundScore).toEqual(risk?.compound_score)
  })

  it('GET/assets/:id/risk should return status 404 Not found when it is not an asset of the same company as the logged user', async () => {
    const assetId = 113
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.v_asset_risk_scores.findFirst.mockResolvedValue(null)
    return request(app)
      .get(`/assets/${assetId}/risk`)
      .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
      .expect(404)
      .expect('Content-Type', /json/);
  })
})
