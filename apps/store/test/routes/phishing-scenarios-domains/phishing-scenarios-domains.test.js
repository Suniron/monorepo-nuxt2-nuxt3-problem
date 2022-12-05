import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
import phishingScenariosDomains from '../../example-values/phishing-scenarios-domains.json'

/**
 * @type {import('@/types/phishingScenariosDomains').PhishingScenariosDomains[]}
 */
describe('/phishing-scenarios-domains', () => {
  describe('GET /', () => {
    it('should return 200 if we fetch with token', async () => {
      prismaMock.company.findFirst.mockResolvedValue({
        fk_phishing_scenario_domain_id: 1,
      })
      prismaMock.phishing_scenario_domain.findMany.mockResolvedValue(
        phishingScenariosDomains
      )
      const finalPhishingScenariosDomains = phishingScenariosDomains.map(
        (psd) => ({
          ...psd,
          isAlreadySelected: psd.id === 1,
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
