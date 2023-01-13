import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
import phishingScenariosDomains from '../../example-values/phishing-scenarios-domains.json'
import { mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'

describe('GET /phishing-scenarios-domains', () => {
  it('should return 200 if we fetch with token', async () => {
    const { token } = mockLoggedAsFullyConnectedUser()
    prismaMock.company.findFirst.mockResolvedValue({
      fk_phishing_scenario_domain_id: 1,
    })

    prismaMock.phishing_scenario_domain.findMany.mockResolvedValue(
      phishingScenariosDomains,
    )
    const finalPhishingScenariosDomains = phishingScenariosDomains.map(
      (psd: any) => ({
        ...psd,
        isAlreadySelected: psd.id === 1,
      }),
    )
    const response = await request(app)
      .get('/phishing-scenarios-domains')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      // .expect('Content-Type', /json/)
    expect(response.body).toEqual(finalPhishingScenariosDomains)
  })
})
