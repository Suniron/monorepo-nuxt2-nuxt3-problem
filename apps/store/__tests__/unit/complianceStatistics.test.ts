// @ts-check

// @ts-expect-error TS(2307): Cannot find module '@/utils/compliance.utils' or i... Remove this comment to see the full error message
import { computeComplianceStatistics } from '@/utils/compliance.utils'
import compliances from '../example-values/compliances'

const expected_statistics = [
  {
    chapter: 'Access Control',
    chapter_small: 'ISO Chapter A.9',
    completion: 10,
    maturity: 6.5,
  },
  {
    chapter: 'Information Security Incident Management',
    chapter_small: 'ISO Chapter A.16',
    completion: 8.3,
    maturity: 5.3,
  },
  {
    chapter: 'Compliance',
    chapter_small: 'ISO Chapter A.18',
    completion: 8.6,
    maturity: 5.7,
  },
  {
    chapter: 'Organization of Information Security',
    chapter_small: 'ISO Chapter A.6',
    completion: 10,
    maturity: 8,
  },
  {
    chapter: 'Human Resources Security',
    chapter_small: 'ISO Chapter A.7',
    completion: 10,
    maturity: 5.5,
  },
  {
    chapter: 'Asset Management',
    chapter_small: 'ISO Chapter A.8',
    completion: 8,
    maturity: 2.2,
  },
  {
    chapter: 'Cryptography',
    chapter_small: 'ISO Chapter A.10',
    completion: 10,
    maturity: 10,
  },
  {
    chapter: 'Physical and Environmental Security',
    chapter_small: 'ISO Chapter A.11',
    completion: 9.3,
    maturity: 6.1,
  },
  {
    chapter: 'Operations Security',
    chapter_small: 'ISO Chapter A.12',
    completion: 3.8,
    maturity: 2.9,
  },
  {
    chapter: 'Communications Security',
    chapter_small: 'ISO Chapter A.13',
    completion: 10,
    maturity: 5.6,
  },
  {
    chapter: 'System Acquisition, Development and Maintenance',
    chapter_small: 'ISO Chapter A.14',
    completion: 2.3,
    maturity: 2.3,
  },
  {
    chapter: 'Supplier Relationships',
    chapter_small: 'ISO Chapter A.15',
    completion: 3.3,
    maturity: 0,
  },
  {
    chapter: 'Information Security Aspects of Business Continuity Management',
    chapter_small: 'ISO Chapter A.17',
    completion: 0,
    maturity: 0,
  },
]

describe('Testing the compliance statistics compute function', () => {
  it('Test with data on ISO 27001 compliance', () => {
    const statistics = computeComplianceStatistics(compliances)
    expect(statistics).toEqual(expected_statistics)
  })
})
