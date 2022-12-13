import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue, mockVerifyToken } from '../../mocks'
import { convertBase64ImageToBuffer } from '../../../src/utils/image.utils'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
import { getNonAdminUser } from '../../utils'
import assetRisk from '../../example-values/asset-risk-scores'

/**
 * @type {import('../../types/company').Company[]}
 */
let companies: any = []

beforeAll(async () => {
  // Get datas:
  companies = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/company.csv')
})

describe('/company', () => {
  describe('PATCH/', () => {
    it('should return a model error if the domain doesnt exists', async () => {
      prismaMock.company.findFirst.mockResolvedValue({
        id: 1,
      })

      prismaMock.phishing_scenario_domain.findFirst.mockResolvedValue(null)
      const response = await request(app)
        .patch('/company')
        .set('Authorization', 'Bearer fake@token')
      expect(response.status).toBe(500)
    })
    it('should return a model error if the company doesnt exists', async () => {
      prismaMock.company.findFirst.mockResolvedValue(null)

      prismaMock.phishing_scenario_domain.findFirst.mockResolvedValue({
        id: 1,
        name: 'fauxdomaine.xrator',
      })
      const response = await request(app)
        .patch('/company')
        .set('Authorization', 'Bearer fake@token')
      expect(response.status).toBe(500)
    })
    it('should update the data if the domain & company exists', async () => {
      prismaMock.company.findFirst.mockResolvedValue({ id: 1 })

      prismaMock.phishing_scenario_domain.findFirst.mockResolvedValue({
        id: 1,
        name: 'fauxdomaine.xrator',
      })
      const response = await request(app)
        .patch('/company')
        .set('Authorization', 'Bearer fake@token')
      expect(response.status).toBe(200)
    })
  })
})

describe('/company/risk/', () => {
  describe('GET /', () => {
    it('should return 200 and the global risk score of the logged user company', async () => {
      const businessMissions = assetRisk.filter(
        ast => ast.asset_type === 'MISSION' && ast.compound_score !== null,
      )

      prismaMock.v_asset_risk_scores.findMany.mockResolvedValue(
        businessMissions,
      )
      const response = await request(app)
        .get('/company/risk/')
        .set('Authorization', 'Bearer fake@token')

      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body).toHaveProperty('globalScore')
      expect(response.body.globalScore).toEqual(
        businessMissions.reduce(
          (acc, mission) => acc + (mission.compound_score ?? 0),
          0,
        ) / businessMissions.length,
      )
    })
  })
})

describe('/company/logo/', () => {
  describe('GET /', () => {
    describe('without auth token', () => {
      it('should return 401 ', async () => {
        const response = await request(app).get('/company/logo/')

        expect(response.status).toBe(401)
      })
    })

    describe('with knex error', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue(['some bad datas'], true)

        const response = await request(app)
          .get('/company/logo/')
          .set('Authorization', 'Bearer fake@token')

        expect(response.type).toBe('application/json')
      })

      it('should be status 500', async () => {
        mockKnexWithFinalValue(['some bad datas'], true)

        const response = await request(app)
          .get('/company/logo/')
          .set('Authorization', 'Bearer fake@token')

        expect(response.status).toBe(500)
      })
    })

    describe('with good company datas', () => {
      it('should be Content-Type json', async () => {
        mockKnexWithFinalValue([companies[0]])
        const response = await request(app)
          .get('/company/logo/')
          .set('Authorization', 'Bearer fake@token')

        expect(response.type).toBe('application/json')
      })

      it('should be status 200', async () => {
        mockKnexWithFinalValue([companies[0]])
        const response = await request(app)
          .get('/company/logo/')
          .set('Authorization', 'Bearer fake@token')

        expect(response.status).toBe(200)
      })

      it('should be same base64 logo string', async () => {
        mockKnexWithFinalValue([
          {
            ...companies[0],
            base64_logo: convertBase64ImageToBuffer(companies[0].base64_logo),
          },
        ])
        const response = await request(app)
          .get('/company/logo/')
          .set('Authorization', 'Bearer fake@token')

        expect(response.body.logo).toEqual(companies[0].base64_logo)
      })
    })
  })

  describe('PATCH /', () => {
    describe('without auth token', () => {
      it('should return 401 ', async () => {
        const response = await request(app).patch('/company/logo/')

        expect(response.status).toBe(401)
      })

      describe('with good logo param BUT knex error', () => {
        it('should be Content-Type json', async () => {
          mockKnexWithFinalValue(['some bad datas'], true)

          const response = await request(app)
            .patch('/company/logo/')
            .set('Authorization', 'Bearer fake@token')
            .send({ logo: companies[0].base64_logo })

          expect(response.type).toBe('application/json')
        })

        it('should be status 500', async () => {
          mockKnexWithFinalValue(['some bad datas'], true)

          const response = await request(app)
            .patch('/company/logo/')
            .set('Authorization', 'Bearer fake@token')
            .send({ logo: companies[0].base64_logo })

          expect(response.status).toBe(500)
        })
      })

      describe('with good company datas', () => {
        describe('without logo in req params', () => {
          it('should be Content-Type json', async () => {
            mockKnexWithFinalValue([companies[0]])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')

            expect(response.type).toBe('application/json')
          })

          it('should be status 400', async () => {
            mockKnexWithFinalValue([companies[0]])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')

            expect(response.status).toBe(400)
          })
        })

        describe('with bad logo param (whithout data:...)', () => {
          it('should be Content-Type json', async () => {
            mockKnexWithFinalValue([])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')
              .send({ logo: 'fake base64 image' })

            expect(response.type).toBe('application/json')
          })

          it('should be status 400', async () => {
            mockKnexWithFinalValue([])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')
              .send({ logo: 'fake base64 image' })

            expect(response.status).toBe(400)
          })
        })

        describe('with bad base64 logo param (badly formatted)', () => {
          it('should be status 400', async () => {
            mockKnexWithFinalValue([])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')
              .send({
                logo: `${companies[0].base64_logo}i_am_a_badly_formatted_extra_string!!!!!!!`,
              })

            expect(response.status).toBe(400)
          })
        })

        describe('with good logo param', () => {
          it('should be status 204', async () => {
            mockKnexWithFinalValue([companies[0]])
            const response = await request(app)
              .patch('/company/logo/')
              .set('Authorization', 'Bearer fake@token')
              .send({ logo: companies[0].base64_logo })

            expect(response.status).toBe(204)
          })
        })
      })
    })

    describe('DELETE /', () => {
      describe('with knex error', () => {
        it('should be Content-Type json', async () => {
          mockKnexWithFinalValue(['some bad datas'], true)

          const response = await request(app)
            .delete('/company/logo/')
            .set('Authorization', 'Bearer fake@token')

          expect(response.type).toBe('application/json')
        })

        it('should be status 500', async () => {
          mockKnexWithFinalValue(['some bad datas'], true)

          const response = await request(app)
            .delete('/company/logo/')
            .set('Authorization', 'Bearer fake@token')

          expect(response.status).toBe(500)
        })
      })

      describe('with good company datas', () => {
        it('should be Content-Type json', async () => {
          mockKnexWithFinalValue([companies[0]])

          const response = await request(app)
            .delete('/company/logo/')
            .set('Authorization', 'Bearer fake@token')

          expect(response.type).toBe('application/json')
        })

        it('should be status 200', async () => {
          mockKnexWithFinalValue([companies[0]])

          const response = await request(app)
            .delete('/company/logo/')
            .set('Authorization', 'Bearer fake@token')

          expect(response.status).toBe(200)
        })
      })
    })
  })
  describe('with good company datas', () => {
    describe('as non-admin', () => {
      beforeAll(() => {
        mockVerifyToken(getNonAdminUser({}))
      })

      describe('with good logo param', () => {
        it('should be status 403', async () => {
          mockKnexWithFinalValue([companies[0]])
          const response = await request(app)
            .patch('/company/logo/')
            .set('Authorization', 'Bearer fake@token')
            .send({ logo: companies[0].base64_logo })

          expect(response.status).toBe(403)
        })
      })
    })
  })
})
