import { prismaMock } from '../mockPrisma'
import {
  getAssetVulnerabilitiesCountBySeverity,
  hasVulnerability,

} from '../../src/models/vulnerabilities'

import { MODEL_ERROR } from '../../src/common/constants'

describe('getAssetVulnerabilitiesCountBySeverity', () => {
  it('Should return model error if prisma throw error', async () => {
    prismaMock.vulnerability_asset.findMany.mockRejectedValue(
      new Error('error'),
    )
    expect((await getAssetVulnerabilitiesCountBySeverity(1, 1))?.error).toBe(
      MODEL_ERROR,
    )
  })

  it('should return the count of vulnerabilties by severity in vulnerabilitiesCount property', async () => {
    prismaMock.vulnerability_asset.findMany.mockResolvedValue([
      { cvss: { score: 5 }, severity: null },
      { cvss: { score: 5.4 }, severity: null },
      { cvss: { score: 6.8 }, severity: null },
      { cvss: { score: 4.3 }, severity: null },
      { cvss: { score: 7.1 }, severity: null },
      { cvss: { score: 7.5 }, severity: null },
      { cvss: { score: 4.3 }, severity: null },
      { cvss: { score: 9.3 }, severity: null },
      { cvss: { score: 4 }, severity: null },
      { cvss: { score: 7.2 }, severity: null },
      { cvss: { score: 9.3 }, severity: null },
      { cvss: { score: 9 }, severity: null },
      { cvss: { score: 5.5 }, severity: null },
      { cvss: { score: 3.7 }, severity: null },
      { cvss: { score: 5 }, severity: null },
      { cvss: { score: 7.6 }, severity: null },
      { cvss: { score: 6.4 }, severity: null },
      { cvss: { score: 7.2 }, severity: null },
      { cvss: { score: 4.9 }, severity: null },
      { cvss: { score: 5 }, severity: null },
      { cvss: { score: 2.1 }, severity: null },
      { cvss: { score: 4.7 }, severity: null },
      { cvss: { score: 2.1 }, severity: null },
      { cvss: { score: 3.7 }, severity: null },
      { cvss: { score: 6.4 }, severity: null },
      { cvss: { score: 2.6 }, severity: null },
    ])
    expect(
      (await getAssetVulnerabilitiesCountBySeverity(1, 1))?.vulnerabilitiesCount,
    ).toEqual({ critical: 3, high: 5, low: 5, medium: 13 })
  })
})

describe('hasVulnerability', () => {
  it('should return false if no vulnerabily', () => {
    expect(hasVulnerability({ critical: 0, high: 0, low: 0, medium: 0 })).toBe(
      false,
    )
  })

  it('should return true if vulnerabily', () => {
    expect(hasVulnerability({ critical: 0, high: 0, low: 1, medium: 0 })).toBe(
      true,
    )
    expect(hasVulnerability({ critical: 0, high: 0, low: 0, medium: 1 })).toBe(
      true,
    )
    expect(hasVulnerability({ critical: 0, high: 1, low: 0, medium: 0 })).toBe(
      true,
    )
    expect(hasVulnerability({ critical: 1, high: 0, low: 0, medium: 0 })).toBe(
      true,
    )
    expect(
      hasVulnerability({ critical: 4, high: 74, low: 14, medium: 50 }),
    ).toBe(true)
  })
})
