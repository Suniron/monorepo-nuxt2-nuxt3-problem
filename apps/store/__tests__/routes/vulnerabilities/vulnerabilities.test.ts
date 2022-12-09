

import request from 'supertest'
import csv from 'csvtojson'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

/**
 * @type {import('@/types/vulnerability').VulnerabilityAssets[]}
 */
let vulnerabilityAssets: any = []
/**
 * @type {import('@/types/vulnerability').Vulnerability[]}
 */
let vulnerabilities: any = []
/**
 * @type {import('@/types/asset').Asset[]}
 */
let assets: any = []
/**
 * @type {import('@/types/groupAsset').GroupAsset[]}
 */
let groupAssets: any = []
/**
 * @type {import('@/types/cvss').Cvss[]}
 */
let cvss: any = []
/**
 * @type {import('@/types/user').UserGroup[]}
 */
let userGroups: any = []

beforeAll(async () => {
  // Get datas:
  vulnerabilityAssets = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/vulnerability_asset.csv')

  vulnerabilities = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/vulnerability.csv')

  assets = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/asset.csv')

  groupAssets = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/group_asset.csv')

  cvss = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/cvss.csv')

  userGroups = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/user_group.csv')
})

/**
 * @param {object} params
 * @param {object} loggedUserInfo
 * @returns {object[]}
 */
export const getVulnerabilityWithTheirAssets = (params: any, loggedUserInfo: any) => {
  const { companyId, roles, id: userId } = loggedUserInfo
  const groups = userGroups

    .filter((ug) => ug.user_id === userId)

    .map((ug) => ug.group_id)
  const assetsIds =
    params.assets_ids?.split(',').map((id: any) => parseInt(id)) || []
  const clustersIds =
    params.clusters_ids?.split(',').map((id: any) => parseInt(id)) || []
  const { vid, search = '', likelihoods = [], severities = [] } = params
  return vulnerabilities
    .filter(

      (vuln) =>
        (vid ? vuln.id.toString() === vid.toString() : true) &&
        (search.length ? vuln.name.includes(search) : true)
    )

    .map((vuln) => {
      return {
        id: vuln.id,
        oid: vuln.oid,
        burp_id: vuln.burp_id,
        affected: vuln.affected,
        description: vuln.description,
        insight: vuln.insight,
        name: vuln.name,
        remediation: vuln.remediation,
        vulndetect: vuln.vulndetect,
        vulnerability_asset: vulnerabilityAssets
          .filter(

            (vast) =>
              vast.vulnerability_id === vuln.id &&
              (assetsIds.length ? assetsIds.includes(vast.asset_id) : true) &&
              (clustersIds.length
                ? clustersIds.includes(vast.cluster_id)
                : true) &&
              (severities.length ? severities.includes(vast.severity) : true) &&
              (likelihoods.length
                ? likelihoods.includes(vast.likelihood)
                : true)
          )

          .map((vast) => {
            return {
              id: vast.id,
              cluster_id: vast.cluster_id,
              severity: vast.severity,
              likelihood: vast.likelihood,

              asset: assets.find((ast) => {
                if (!roles.includes('admin')) {
                  return (
                    ast.id === vast.asset_id &&
                    ast.company_id.toString() === companyId.toString() &&
                    groupAssets.find(

                      (grp) =>
                        grp.asset_id === ast.id && groups.includes(grp.group_id)
                    )
                  )
                }
                return (
                  ast.id === vast.asset_id &&
                  ast.company_id.toString() === companyId.toString()
                )
              }),

              cvss: cvss.find((cvss) => cvss.id === vast.cvss_id),
              remediation_project_scope: [],
            }
          })

          .filter((vast) => vast.asset),
      }
    })

    .filter((vuln) => vuln.vulnerability_asset.length > 0)
}

// These are only the two fields required
const expectedVulnerability = {
  id: expect.any(String),
  affectedAssets: expect.any(Array),
}

describe('/vulnerabilities/assets', () => {
  describe('GET /', () => {
    it('as admin without any parameters should return all vulnerabilities with their assets', async () => {
      const getVulnerabilities = getVulnerabilityWithTheirAssets(
        {},
        {
          companyId: 1,
          roles: ['admin'],
          id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
        }
      )

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)

      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(
        getVulnerabilities.length
      )
      // for each vulnerability, check its format
      response.body.vulnerabilities.forEach((vuln: any) => {
        expect(vuln).toMatchObject(expectedVulnerability)
      })
    })

    it('as admin with pagination parameters should return only one page of vulnerabilities with their assets', async () => {
      const params = { page: 5, page_size: 14 }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(
        {},
        {
          companyId: 1,
          roles: ['admin'],
          id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
        }
      )

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)

      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .query(params)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(params.page_size)
      expect(response.body.vulnerabilities[0].id).toEqual(
        getVulnerabilities[params.page_size * (params.page - 1)].id
      )
    })

    it('as admin with search param should return only vulnerabilities that match the research with their assets', async () => {
      const params = { search: 'Adobe' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['admin'],
        id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .query(params)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(
        getVulnerabilities.length
      )
      // for each vulnerability, check its format and if its name contains the search parameter
      response.body.vulnerabilities.forEach((vuln: any) => {
        expect(vuln).toMatchObject(expectedVulnerability)
        expect(vuln).toHaveProperty('name')
        expect(vuln.name).toContain(params.search)
      })
    })

    it('as admin with severities filter should return only vulnerabilities that match the severities with their assets', async () => {
      const params = { severities: ['high'] }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['admin'],
        id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .query(params)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(
        getVulnerabilities.length
      )
      // for each vulnerability, check its format and if its affected assets match the severities filter
      response.body.vulnerabilities.forEach((vuln: any) => {
        expect(vuln).toMatchObject(expectedVulnerability)
        vuln.affectedAssets.forEach((ast: any) => {
          expect(params.severities).toContain(

            vulnerabilityAssets.find((vast) => vast.id === ast.vastId)?.severity
          )
        })
      })
    })

    it('as admin with assets ids and clusters ids filter should return all vulnerabilities matching assets ids and cluster ids with their assets', async () => {
      const params = { assets_ids: '4,5,6', clusters_ids: '246' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['admin'],
        id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .query(params)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(
        getVulnerabilities.length
      )
      // for each vulnerability, check its format and if its affected assets match assets_ids and clusters_id filters
      response.body.vulnerabilities.forEach((vuln: any) => {
        expect(vuln).toMatchObject(expectedVulnerability)
        vuln.affectedAssets.forEach((ast: any) => {
          expect(params.assets_ids).toContain(ast.id.toString())
          expect(params.clusters_ids).toContain(ast.clusterId.toString())
        })
      })
    })

    it('as non admin with no group return 0 result', async () => {
      const getVulnerabilities = getVulnerabilityWithTheirAssets(
        {},
        {
          companyId: 1,
          roles: ['member'],
          id: '2a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
        }
      )

      prismaMock.user_group.findMany.mockResolvedValue([])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(0)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(response.body.vulnerabilities).toEqual([])
    })

    it('as non admin in one group return only vulnerabilities with assets of the same group as the user', async () => {
      const getVulnerabilities = getVulnerabilityWithTheirAssets(
        {},
        {
          companyId: 1,
          roles: ['member'],
          id: 'd090ea8b-7957-4ad3-86ec-0959cf0a060b',
        }
      )
      const groups = userGroups

        .filter((ug) => ug.user_id === 'd090ea8b-7957-4ad3-86ec-0959cf0a060b')

        .map((ug) => ug.group_id)

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get('/vulnerabilities/assets')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('total')
      expect(response.body.total).toEqual(getVulnerabilities.length)
      expect(response.body).toHaveProperty('vulnerabilities')
      expect(Array.isArray(response.body.vulnerabilities)).toBe(true)
      expect(response.body.vulnerabilities).toHaveLength(
        getVulnerabilities.length
      )
      // For each vulnerability, check its format and if its affected assets belong to the same group as the user
      response.body.vulnerabilities.forEach((vuln: any) => {
        expect(vuln).toMatchObject(expectedVulnerability)
        vuln.affectedAssets.forEach((ast: any) => {
          expect(groups).toContain(
            groupAssets.find(

              (ga) => ga.asset_id === ast.id && groups.includes(ga.group_id)
            )?.group_id
          )
        })
      })
    })
  })
})

describe('/vulnerabilities/:vid/assets', () => {
  describe('GET /', () => {
    it('as admin without any params except for the vid should return the vulnerability with the right id', async () => {
      const params = { vid: '16' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['admin'],
        id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get(`/vulnerabilities/${params.vid}/assets`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(expectedVulnerability)
      expect(response.body.id).toEqual(params.vid)
      expect(Array.isArray(response.body.affectedAssets)).toBe(true)
      expect(response.body.affectedAssets.length).toBeGreaterThan(0)
    })

    it('as admin with search params that does not match the vulnerability that has the requested id should return not found', async () => {
      const params = { vid: '16', search: 'Bad research' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['admin'],
        id: 'd080ea8b-7957-4ad3-86ec-0959cf0a050b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get(`/vulnerabilities/${params.vid}/assets`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .query({ search: params.search })
      expect(response.status).toBe(404)
    })

    it('as non admin with no group with vid matching an existing vulnerability should return not found', async () => {
      const params = { vid: '16' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['member'],
        id: '2a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
      })

      prismaMock.user_group.findMany.mockResolvedValue([])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get(`/vulnerabilities/${params.vid}/assets`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(404)
    })

    it('as non admin with the same group as the vulnerability that has the requested vid should return the vulnerability', async () => {
      const params = { vid: '18' }
      const getVulnerabilities = getVulnerabilityWithTheirAssets(params, {
        companyId: 1,
        roles: ['member'],
        id: 'd090ea8b-7957-4ad3-86ec-0959cf0a060b',
      })

      prismaMock.user_group.findMany.mockResolvedValue([
        {
          group_id: 1,
          user_id: 'user id',
        },
      ])

      prismaMock.vulnerability.findMany.mockResolvedValue(getVulnerabilities)
      const response = await request(app)
        .get(`/vulnerabilities/${params.vid}/assets`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(expectedVulnerability)
      expect(response.body.id).toEqual(params.vid)
      expect(Array.isArray(response.body.affectedAssets)).toBe(true)
      expect(response.body.affectedAssets.length).toBeGreaterThan(0)
    })
  })
})
