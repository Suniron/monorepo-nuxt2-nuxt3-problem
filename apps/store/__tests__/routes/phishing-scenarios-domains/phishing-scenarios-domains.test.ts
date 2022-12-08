// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/phishing-... Remove this comment to see the full error message
import phishingScenariosDomains from '../../example-values/phishing-scenarios-domains.json'

/**
 * @type {import('@/types/phishingScenariosDomains').PhishingScenariosDomains[]}
 */
describe('/phishing-scenarios-domains', () => {
  describe('GET /', () => {
    it('should return 200 if we fetch with token', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.company.findFirst.mockResolvedValue({
        fk_phishing_scenario_domain_id: 1,
      })
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.phishing_scenario_domain.findMany.mockResolvedValue(
        phishingScenariosDomains
      )
      const finalPhishingScenariosDomains = phishingScenariosDomains.map(
        (psd: any) => ({
          ...psd,
          isAlreadySelected: psd.id === 1
        })
      )
      const response = await request(app)
        .get('/phishing-scenarios-domains')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
      // .expect('Content-Type', /json/)
      expect(response.body).toEqual(finalPhishingScenariosDomains)
    })
  })
})
