import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
  VALIDATION_ERROR,

} from '../../../src/common/constants'

import { knex } from '../../../src/common/db'

import { log } from '../../../src/lib/logger'

import prismaClient from '../../../src/prismaClient'

import { getUserGroupIds } from '../../../src/utils/user.utils'

/**
 * @typedef {import('@/types/vulnerability').VulnerabilityWithItsAffectedAssets} VulnerabilityWithItsAffectedAssets
 */

const SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  INFO: 'info',
  LOW: 'low',
  MEDIUM: 'medium',
}

/**
 * @param {number} score
 * @returns {string|null} the corresponding severity level
 */
const getSeverityLevel = (score: any) => {
  if (score) {
    let severity = SEVERITY.CRITICAL
    if (score === 0)
      severity = SEVERITY.INFO
    else if (score <= 3.9)
      severity = SEVERITY.LOW
    else if (score <= 6.9)
      severity = SEVERITY.MEDIUM
    else if (score <= 8.9)
      severity = SEVERITY.HIGH

    return severity
  }
  return null
}

/**
 * @param {object} vulnerability
 * @returns {object} Return the same vulnerability object with new property severity level
 */
const fillVulnerabilityData = (vulnerability: any) => {
  vulnerability.details?.forEach((elt: any) => {
    if (!elt.severity && elt.cvss_score !== null) {
      const score = elt.cvss_score

      elt.severity = getSeverityLevel(score)
    }
  })

  return vulnerability
}

/**
 *
 * @param {number} assetId ID of the asset to which this vulnerabilities belong to
 * @param {object} params Search params
 * @param {string} params.search Search string to search vulnerabilities by name
 * @param {string} params.severities Comma-separated string-array of severity levels.
 *                                   Filters vulnerabilities by severity level.
 * @returns {Promise<{ error: string } | {
 *  vulnerabilities: object[],
 *  total: number
 * }>} List of vulnerabilities if successful. Error if failed.
 */
export const getAssetVulnerabilitiesModel = async (
  assetId: any,
  params: any,
  loggedUserInfo = {},
) => {
  try {
    const { type = 'vulnerability' } = params

    const { companyId } = loggedUserInfo
    const query = knex
      .select({
        affected: 'vul.affected',
        description: 'vul.description',
        details: knex.raw(`coalesce(array_agg(json_build_object(
          'vast_id', vip.id,
          'details', vip.details,
          'custom_description', vip.custom_description,
          'custom_remediation', vip.custom_remediation,
          'cvss_code', cvss.code, 
          'cvss_score', cvss.score, 
          'severity', vip.severity, 
          'confidence', vip.confidence, 
          'likelihood', vip.likelihood, 
          'status', vip.status,
          'ip', ip.address,
          'port', port.number,
          'protocol', port.protocol,
          'vuln_publication_date', vip.vuln_publication_date,
          'uri', uri.uri
          )), '{}')`),
        insight: 'vul.insight',
        name: 'vul.name',
        references: 'refs.refs',
        remediation: 'vul.remediation',
        vulndetect: 'vul.vulndetect',
        vulnerability_id: 'vul.id',
      })
      .from({ vip: 'vulnerability_asset' })
      .innerJoin({ ast: 'asset' }, { 'ast.id': 'vip.asset_id' })
      .innerJoin({ cp: 'company' }, { 'cp.id': 'ast.company_id' })
      .innerJoin('vulnerability as vul', 'vip.vulnerability_id', 'vul.id')
      .leftJoin('cvss', { 'cvss.id': 'vip.cvss_id' })
      .leftJoin('port', { 'port.id': 'vip.port_id' })
      .leftJoin('ip', { 'ip.id': 'vip.ip_id' })
      .leftJoin('uri', { 'uri.id': 'vip.uri_id' })
      .where('cp.id', companyId)
      .andWhere('vul.type', type)
      .groupBy('vul.id', 'refs.refs')

    const refsJoin = knex
      .select(
        'vulnerability_id',
        knex.raw(
          'array_agg(jsonb_build_object(\'type\', ref.type, \'value\', ref.value)) as refs',
        ),
      )
      .from({ ref: 'reference' })
      .groupBy('vulnerability_id')
    query.leftJoin({ refs: refsJoin }, { 'refs.vulnerability_id': 'vul.id' })

    query.where('vip.asset_id', assetId)
    // Search params
    const { search, severities } = params
    if (search) {
      query.where(
        knex.raw('LOWER(vul.name) LIKE ?', `%${search.toLowerCase()}%`),
      )
    }

    if (severities) {
      const SEVERITY_RANGES = {
        [SEVERITY.LOW]: [0, 3.9],
        [SEVERITY.MEDIUM]: [4, 6.9],
        [SEVERITY.HIGH]: [7, 8.9],
        [SEVERITY.CRITICAL]: [9, 10],
      }
      const arrSeverities = severities
        .split(',')
        .map((sev: any) => sev.toLowerCase())
      const arrSevRanges = arrSeverities
        .map((sev: any) => SEVERITY_RANGES[sev])
        .filter((sevRange: any) => !!sevRange) // If not valid severity level, need to filter undefined ranges

      query.where((qb: any) => {
        arrSevRanges.forEach((sevRange: any) => {
          qb.orWhereBetween('cvss.score', sevRange)
        })
      })
    }

    const result = await query
    if (Array.isArray(result)) {
      return {
        total: result.length,
        vulnerabilities: result.map(fillVulnerabilityData),
      }
    }

    return { error: MODEL_ERROR }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {number} assetId The asset id to update the status to
 * @param {number} vulnId The vulnerability id to update the statis to
 * @param {string} params.updated The new status
 * @param {string} params.comment Supportive evidence or comment for status change
 *
 * @returns True if transaction worked
 */
export const UpdateVulnerabilitiesModel = async (body: any) => {
  let {
    ipId,
    portId,
  }: any = {}
  const result = await knex
    .select({ ipId: 'ip.id', portId: 'port.id' })
    .from('port')
    .leftJoin({ ip: 'ip' }, { 'ip.id': 'port.ip_id' })
    .where('ip.address', body.vuln.ip)
    .andWhere('port.number', Number(body.vuln.port))
    .andWhere('port.protocol', body.vuln.protocol)

  if (result[0]) {
    ipId = result[0].ipId
    portId = result[0].portId
  }
  const info = (
    await knex('vulnerability_asset')
      .where('id', Number(body.vuln.vast_id))
      .update({
        custom_description: body.vuln.custom_description,
        custom_remediation: body.vuln.custom_remediation,
        details: body.vuln.details,
        ip_id: ipId,
        port_id: portId,
      })
      .returning('cvss_id')
  ).map((e: any) => e.cvss_id)
  if (info !== undefined) {
    const isGood = await knex('cvss').where('id', Number(info[0])).update({
      code: body.vuln.code,
      score: body.vuln.score,
      version: body.vuln.version,
    })
    if (isGood)
      return true
  }
  return false
}
/**
 * @param {*} body
 * @returns
 */
export const DeleteVulnerabilitiesModel = async () => {
  // TODO: find why it's unused
  // const info = await knex('vulnerability_asset')
  //   .where('id', Number(body.vastId))
  //   .del()
  return true
}
export const updateStatusModel = async (
  assetId: any,
  vulnId: any,
  params: any,
  loggedUserInfo = {},
) => {
  try {
    if (!assetId || !vulnId)
      return { error: VALIDATION_ERROR }
    if (!params || !Object.entries(params).length)
      return { status: SUCCESS } // nothing to update

    const { companyId } = loggedUserInfo
    const { error, status } = await knex.transaction(async (tx: any) => {
      const { updated, comment } = params
      const vipToUpdate = await tx
        .select({ status: 'vip.status', vulnerability_id: 'vip.id' })
        .from({ vip: 'vulnerability_asset' })
        .innerJoin({ asset: 'asset' }, { 'vip.asset_id': 'asset.id' })
        .innerJoin({ cp: 'company' }, { 'asset.company_id': 'cp.id' })
        .where({
          'asset.id': assetId,
          'cp.id': companyId,
          'vip.id': vulnId,
        })
      if (!vipToUpdate || vipToUpdate.length !== 1)
        return { error: NOT_FOUND } // Not found

      if (updated !== vipToUpdate.status) {
        const orig = vipToUpdate[0].status
        const updates = [
          tx('vulnerability_asset')
            .where('id', vulnId)
            .update({ status: updated }),
          tx('status_update').insert({
            cdate: new Date(),
            comment,
            orig_status: orig,
            updated_status: updated,
            vulnerability_asset_id: vipToUpdate[0].vulnerability_id,
          }),
        ]
        await Promise.all(updates)
      }
      return { status: SUCCESS }
    })
    return error ? { error } : { status }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const addPostAssetVulnerabilityModel = async (
  assetId: any,
  vulnId: any,
  params: any,
  loggedUserInfo = {},
) => {
  const { id } = loggedUserInfo
  const { comment } = params

  const [assetExist] = await knex
    .select()
    .from('vulnerability_asset as vast')
    .where({ 'vast.asset_id': assetId, 'vast.id': vulnId })
  if (!assetExist)
    return { status: UNAUTHORIZED }

  const { error, status } = await knex.transaction(async (tx: any) => {
    const query = tx('comment').insert({
      comment,
      created_at: new Date(),
      user_id: id,
      vulnerability_asset_id: vulnId,
    })
    await Promise.all([query])
    return { status: SUCCESS }
  })
  return error ? { error } : { status }
}

export const searchPostAssetVulnerabilityModel = async (
  assetId: any,
  vulnId: any,
  loggedUserInfo = {},
) => {
  const { companyId } = loggedUserInfo

  const query = knex
    .select({
      comment: 'cmt.comment',
      commentId: 'cmt.id',
      createdAt: 'cmt.created_at',
      firstName: 'usr.first_name',
      lastName: 'usr.last_name',
      vulnId: 'cmt.vulnerability_asset_id',
    })
    .from('comment as cmt')
    .innerJoin('user as usr', { 'usr.id': 'cmt.user_id' })
    .innerJoin('company as cp', { 'cp.id': 'usr.company_id' })
    .innerJoin(
      'vulnerability_asset as vast',
      'vast.id',
      'cmt.vulnerability_asset_id',
    )
    .where({
      'cmt.vulnerability_asset_id': vulnId,
      'cp.id': companyId,
      'vast.asset_id': assetId,
    })
    .orderBy('cmt.created_at', 'desc')
  const comments = await query
  return { comments, total: comments.length }
}

/**
 * Search for vulnerabilities
 *
 * @param {object} params Search parameters
 * @param {number} params.vid Vulnerability ID
 * @param {string} params.search Search string to filter by name
 * @returns {Promise<
 *  { error: string } |
 *  {
 *    vulnerabilities: object[],
 *    total: number
 *  } |
 *  { vulnerability: object }
 * >} Single vulnerability object if params.vid provided. List of vulnerabilities otherwise. Error if failed.
 */
export const searchVulnerabilitiesModel = async (params: any) => {
  try {
    const { vid, search } = params
    const query = knex.select().from('vulnerability as vul')

    if (vid) {
      query.where('vul.id', vid)
    }
    else if (search) {
      query.where(function (this: any) {
        this.where(
          knex.raw('LOWER(vul.name)'),
          'like',
          knex.raw('?', `%${search.toLowerCase()}%`),
        )
          .orWhere(knex.raw('LOWER(vul.oid)'), search.toLowerCase())
          .orWhere(
            'vul.burp_id',
            isNaN(parseInt(search)) ? -1 : parseInt(search),
          )
      })
    }
    const vulnerabilities = await query
    if (Array.isArray(vulnerabilities)) {
      if (vid) {
        const [vulnerability] = vulnerabilities
        if (vulnerability)
          return { vulnerability }
        else return { error: NOT_FOUND }
      }
      return { total: vulnerabilities.length, vulnerabilities }
    }
    return { error: MODEL_ERROR }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 * Search for vulnerabilities
 *
 * @param {object} params Search parameters
 * @param {number} params.vid Vulnerability ID
 * @param {string} params.search Search string to filter by name
 * @param {number} params.page The page number for pagination
 * @param {number} params.page_size The number of items per page for pagination
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<
 *  { error: string } |
 *  {
 *    vulnerabilities: VulnerabilityWithItsAffectedAssets[],
 *    total: number
 *  } |
 *  { vulnerability: VulnerabilityWithItsAffectedAssets }
 * >} Single vulnerability object if params.vid provided. List of vulnerabilities otherwise. Error if failed.
 */
export const searchVulnerabilitiesWithTheirAssetsModel = async (
  params: any,
  loggedUserInfo = {},
) => {
  try {
    const { companyId, roles, id: userId } = loggedUserInfo
    const groups = await getUserGroupIds(userId)
    const assetsIds = params.assets_ids?.split(',').map((id: any) => parseInt(id))
    const clustersIds = params.clusters_ids
      ?.split(',')
      .map((id: any) => parseInt(id))
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.page_size) || undefined
    // Where conditions
    const { vid, search = '', likelihoods, severities } = params

    let vulnerabilities = await prismaClient.vulnerability
      .findMany({
        orderBy: pageSize
          ? {
              vulnerability_asset: {
                _count: 'desc',
              },
            }
          : { id: 'asc' },
        select: {
          affected: true,
          burp_id: true,
          cluster_id: true,
          description: true,
          id: true,
          insight: true,
          name: true,
          oid: true,
          remediation: true,
          vulndetect: true,
          vulnerability_asset: {
            orderBy: {
              asset_id: 'asc',
            },
            select: {
              asset: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
              cvss: {
                select: {
                  score: true,
                },
              },
              id: true,
              likelihood: true,
              remediation_project_scope: {
                select: {
                  remediation_project: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              severity: true,
              status: true,
            },
            where: {
              asset: {
                company_id: companyId,
                group_asset: {
                  some: roles.includes('admin')
                    ? undefined
                    : {
                        group_id: { in: groups },
                      },
                },
              },
              asset_id: {
                in: assetsIds,
              },
              likelihood: {
                in: likelihoods,
              },
              severity: {
                in: severities,
              },
            },
          },
        },
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              oid: {
                equals: search,
              },
            },
            {
              burp_id: {
                equals: !isNaN(parseInt(search)) ? parseInt(search) : undefined,
              },
            },
          ],
          cluster_id: {
            in: clustersIds,
          },
          id: {
            equals: !isNaN(parseInt(vid)) ? parseInt(vid) : undefined,
          },
          vulnerability_asset: {
            some: {
              asset: {
                company_id: companyId,
                group_asset: {
                  some: !roles.includes('admin')
                    ? {
                        group_id: { in: groups },
                      }
                    : undefined,
                },
              },
              asset_id: {
                in: assetsIds,
              },
              likelihood: {
                in: likelihoods,
              },
              severity: {
                in: severities,
              },
            },
          },
        },
      })
      .then((vulnerabilities: any) => vulnerabilities.map((vuln: any) => {
        const { vulnerability_asset, ...vulnerability } = vuln
        return {
          ...vulnerability,
          affectedAssets: vulnerability_asset.map((vast: any) => {
            return {
              assetType: vast.asset?.type,
              cvssScore: vast.cvss?.score,
              id: vast.asset?.id,
              name: vast.asset?.name,
              projects: vast.remediation_project_scope.map(
                (scope: any) => scope.remediation_project,
              ),
              severity: vast.cvss?.score
                ? getSeverityLevel(vast.cvss?.score)
                : vast.severity,
              status: vast.status,
              vastId: vast.id,
            }
          }),
        }
      }),
      )

    if (Array.isArray(vulnerabilities)) {
      if (vid) {
        const [vulnerability] = vulnerabilities
        if (vulnerability)
          return { vulnerability }
        else return { error: NOT_FOUND }
      }

      const total = vulnerabilities.length
      if (pageSize) {
        vulnerabilities = vulnerabilities.slice(
          (page - 1) * pageSize,
          page * pageSize,
        )
      }
      return { total, vulnerabilities }
    }

    return { error: MODEL_ERROR }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const createVulnerabilityModel = async (params: any) => {
  try {
    const {
      oid = null,
      name,
      type = 'vulnerability',
      baseline = '',
      description = '',
      remediation = null,
      insight = '',
      affected = '',
      vulndetect = '',
      refs = [],
    } = params
    const vulnId = await knex.transaction(async (tx: any) => {
      const [{ id }] = await tx('vulnerability').returning('id').insert({
        affected,
        baseline,
        description,
        insight,
        name,
        oid,
        remediation,
        type,
        vulndetect,
      })
      for (const idx in refs) {
        const { type = '', value = '' } = refs[idx]
        await tx('reference').insert({ type, value, vulnerability_id: id })
      }
      return id
    })
    return vulnId
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} vulnId
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const updateVulnerabilityModel = async (vulnId: any, params: any) => {
  try {
    const [vulnExist] = await knex
      .select()
      .from('vulnerability')
      .where('id', vulnId)
    if (!vulnExist)
      return { error: MODEL_ERROR }
    const {
      name = vulnExist.name,
      description = vulnExist.description,
      remediation = vulnExist.remediation,
      insight = vulnExist.insight,
      affected = vulnExist.affected,
      vulndetect = vulnExist.vulndetect,
    } = params
    await knex.transaction(async (tx: any) => {
      await tx('vulnerability')
        .update({
          affected,
          description,
          insight,
          name,
          remediation,
          vulndetect,
        })
        .where('id', vulnId)
    })
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {import('@prisma/client').company['id']} companyId
 * @param {import('@prisma/client').asset['id']} assetId
 */
export const getAssetVulnerabilitiesCountBySeverity = async (
  companyId: any,
  assetId: any,
) => {
  try {
    const vulnerabilitiesCount = {
      critical: 0,
      high: 0,
      low: 0,
      medium: 0,
    }

    // Write your query here!
    const vulnerabilitiesAssets = await prismaClient.vulnerability_asset.findMany(
      {
        select: {
          cvss: { select: { score: true } },
          severity: true,
        },
        where: { asset: { company_id: companyId, id: assetId } },
      },
    )

    vulnerabilitiesAssets.forEach((va: any) => {
      switch (true) {
        case va.severity === 'low' || (va.cvss?.score && va.cvss.score <= 3.9):
          vulnerabilitiesCount.low++
          break
        case va.severity === 'medium'
          || (va.cvss?.score && va.cvss.score >= 4 && va.cvss.score <= 6.9):
          vulnerabilitiesCount.medium++
          break
        case va.severity === 'high'
          || (va.cvss?.score && va.cvss.score >= 7 && va.cvss.score <= 8.9):
          vulnerabilitiesCount.high++
          break
        case va.severity === 'critical'
          || (va.cvss?.score && va.cvss.score >= 9):
          vulnerabilitiesCount.critical++
          break
        default:
          break
      }
    })

    return { vulnerabilitiesCount }
  }
  catch (error) {
    log.withError(error).error('getAssetVulnerabilitiesCountBySeverity error')
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {{low: number, medium: number, high: number, critical: number}} vulnerabilities
 */
export const hasVulnerability = (vulnerabilities: any) => {
  for (const severity of Object.keys(vulnerabilities)) {
    if (vulnerabilities[severity] > 0)
      return true
  }

  return false
}
