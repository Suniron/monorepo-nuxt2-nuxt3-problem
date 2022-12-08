// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, SUCCESS } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'

/* Chart Queries */

/**
 * Parameters used for fetching dashboard charts data
 *
 * @typedef {object} ChartParams
 * @property {number} companyId Company ID from which to obtain charts data
 * @property {string} [cid] Chart ID. Used in this model to identify which chart to fetch data from
 * @property {string} [charts] Comma-separated string-array of chart IDs. Used when requesting multiple
 *                             specific charts. If not given, it will fetch all dashboard charts
 * @property {string} [top] Number of top N vulnerabilities to return
 */

/**
 * Fetches the severities summary of a company
 *
 * @param {ChartParams} params Params to retrieve severities summary of a company
 * @returns {Promise<{
 *  low: number,
 *  medium: number,
 *  high: number,
 *  critical: number,
 * }>} Total amout of vulnerabilities found in a company
 */
const fetchSeveritiesSummary = async (params: any) => {
  if (!params.companyId)
    throw new Error(
      'Param "companyId" required to fetch company severities summary'
    )

  const { companyId } = params
  const query = knex
    .select({
      low: knex.raw(
        "count(vast.id) FILTER (WHERE vast.severity = 'low' or cvss.score <= 3.9)"
      ),
      medium: knex.raw(
        "count(vast.id) FILTER (WHERE vast.severity = 'medium' or (cvss.score <= 6.9 and cvss.score >= 4))"
      ),
      high: knex.raw(
        "count(vast.id) FILTER (WHERE vast.severity = 'high' or (cvss.score <= 8.9 and cvss.score >= 7))"
      ),
      critical: knex.raw(
        "count(vast.id) FILTER (WHERE vast.severity = 'critical' or cvss.score >= 9)"
      ),
    })
    .from({ vast: 'vulnerability_asset' })
    .innerJoin({ ast: 'asset' }, { 'ast.id': 'vast.asset_id' })
    .innerJoin({ cp: 'company' }, { 'cp.id': 'ast.company_id' })
    .leftJoin('cvss', { 'cvss.id': 'vast.cvss_id' })
    .where('cp.id', companyId)
    .andWhere(function(this: any) {
      this.where('vast.status', 'open').orWhere('vast.status', null)
    })

  const [severitiesSummary] = await query

  return {
    severitiesSummary: {
      low: Number(severitiesSummary.low),
      medium: Number(severitiesSummary.medium),
      high: Number(severitiesSummary.high),
      critical: Number(severitiesSummary.critical),
    },
  }
}

/**
 * Fetches the global rating of all company assets
 *
 * @param {ChartParams} params Params to retrieve chart data
 * @returns {Promise<{ global: number }>}
 */
const fetchGlobalRating = async () => {
  return { global: 42 }
}

/**
 * Fetches the top N vulnerabilities recurring in a company's assets
 *
 * @param {ChartParams} params Params to retrieve chart data
 * @returns {Promise<{ topVulnerabilities: object[] }>}
 */
const fetchTopNVulnerabilities = async (params: any) => {
  if (!params.companyId)
    throw new Error(
      'Param "companyId" required to fetch company top vulnerabilities'
    )
  const { companyId, top } = params
  const numVulns = Number(top) || 5

  const query = knex
    .select('id', 'name', knex.raw('count(*) as ocurrences'))
    .from(
      knex
        .select('vuln.id', 'vuln.name')
        .from('vulnerability_asset as vast')
        .innerJoin(
          { vuln: 'vulnerability' },
          { 'vuln.id': 'vast.vulnerability_id' }
        )
        .innerJoin({ ast: 'asset' }, { 'ast.id': 'vast.asset_id' })
        .innerJoin({ cp: 'company' }, { 'cp.id': 'ast.company_id' })
        .where('cp.id', companyId)
        .andWhere(function(this: any) {
          this.where(knex.raw('LOWER(vast.status)'), 'open').orWhere(
            'vast.status',
            null
          )
        })
        .as('all_assets')
    )
    .groupBy('id', 'name')
    .orderBy('ocurrences', 'desc')

  const vulnerabilities = await query
  const totalVulns = vulnerabilities.reduce(
    (total: any, vuln: any) => total + Number(vuln.ocurrences),
    0
  )

  return {
    topVulnerabilities: vulnerabilities.slice(0, numVulns).map((v: any) => ({
      ...v,
      ocurrences: Number(v.ocurrences),
      percent: Math.round((Number(v.ocurrences) / totalVulns) * 100)
    })),
  };
}

/**
 * Levels of likelihoods of a vulnerability to be exploited
 *
 * @typedef {object} LikelihoodLevels
 * @property {number} rare
 * @property {number} unlikely
 * @property {number} moderate
 * @property {number} likely
 * @property {number} certain
 */

/**
 * Fetches the likelihood of different vulnerabilities to be exploited
 *
 * @param {ChartParams} params Params to retrieve chart data
 * @returns {Promise<{
 *   likelihoods: {
 *     critical: LikelihoodLevels,
 *     high: LikelihoodLevels,
 *     medium: LikelihoodLevels,
 *     low: LikelihoodLevels
 *   }
 * }>}
 */
export const fetchVulnerabilityLikelihoods = async (params: any) => {
  if (!params.companyId)
    throw new Error(
      'Param "companyId" required to fetch vulnerability likelihoods'
    )

  const { companyId } = params

  const [likelihoods] = await knex
    .select({
      // asset_id: 'asset_id',
      low_rare: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'rare' and (LOWER(vast.severity) = 'low' or cvss.score <= 3.9))"
      ),
      low_unlikely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'unlikely' and (LOWER(vast.severity) = 'low' or cvss.score <= 3.9))"
      ),
      low_moderate: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'moderate' and (LOWER(vast.severity) = 'low' or cvss.score <= 3.9))"
      ),
      low_likely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'likely' and (LOWER(vast.severity) = 'low' or cvss.score <= 3.9))"
      ),
      low_almost_certain: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'certain' and (LOWER(vast.severity) = 'low' or cvss.score <= 3.9))"
      ),
      medium_rare: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'rare' and (LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9)))"
      ),
      medium_unlikely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'unlikely' and (LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9)))"
      ),
      medium_moderate: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'moderate' and (LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9)))"
      ),
      medium_likely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'likely' and (LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9)))"
      ),
      medium_almost_certain: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'certain' and (LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9)))"
      ),
      high_rare: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'rare' and (LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9)))"
      ),
      high_unlikely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'unlikely' and (LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9)))"
      ),
      high_moderate: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'moderate' and (LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9)))"
      ),
      high_likely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'likely' and (LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9)))"
      ),
      high_almost_certain: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'certain' and (LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9)))"
      ),
      critical_rare: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'rare' and (LOWER(vast.severity) = 'critical' or cvss.score >= 9))"
      ),
      critcal_unlikely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'unlikely' and (LOWER(vast.severity) = 'critical' or cvss.score >= 9))"
      ),
      critical_moderate: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'moderate' and (LOWER(vast.severity) = 'critical' or cvss.score >= 9))"
      ),
      critical_likely: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'likely' and (LOWER(vast.severity) = 'critical' or cvss.score >= 9))"
      ),
      critical_almost_certain: knex.raw(
        "count(vast.id) filter (where vast.likelihood = 'certain' and (LOWER(vast.severity) = 'critical' or cvss.score >= 9))"
      ),
    })
    .from('vulnerability_asset as vast')
    .leftJoin('cvss', { 'cvss.id': 'vast.cvss_id' })
    .innerJoin('asset as ast', 'ast.id', 'vast.asset_id')
    .innerJoin('vulnerability as vuln', 'vuln.id', 'vast.vulnerability_id')
    .where('ast.company_id', companyId)
    .andWhere('vuln.type', 'vulnerability')
    .andWhere(function(this: any) {
      this.whereRaw(`status is NULL`).orWhereRaw(`LOWER(status) = 'open'`)
    })
  // .groupBy('asset_id')

  /* 
  const query = knex
    .select('severity', 'code', 'score')
    .from('vulnerability_asset as vast')
    .innerJoin('vulnerability as vuln', 'vuln.id', 'vast.vulnerability_id')
    .innerJoin('cvss', 'vast.cvss_id', 'cvss.id')
    .innerJoin('asset as ast', 'vast.asset_id', 'ast.id')
    .innerJoin('company as cmp', 'ast.company_id', 'cmp.id')
    .where('cmp.id', companyId)
    .andWhere('vuln.type','vulnerability')
  const query = knex
    .select('severity', 'code', 'score')
    .from('vulnerability_ip as vip')
    .innerJoin('cvss', 'vip.cvss_id', 'cvss.id')
    .innerJoin('ip', 'vip.ip_id', 'ip.id')
    .innerJoin('asset as ast', 'ip.asset_id', 'ast.id')
    .innerJoin('assets_network as asn', 'ast.assets_network_id', 'asn.id')
    .innerJoin('company as cmp', 'asn.company_id', 'cmp.id')
    .where('cmp.id', companyId)
    const vulnerabilities = await query
    const SEVERITY = {
      INFO: 'info',
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical',
    }
  const likelihoods = {
    critical: {
      rare: 0,
      unlikely: 0,
      moderate: 0,
      likely: 0,
      certain: 0,
    },
    high: {
      rare: 0,
      unlikely: 0,
      moderate: 0,
      likely: 0,
      certain: 0,
    },
    medium: {
      rare: 0,
      unlikely: 0,
      moderate: 0,
      likely: 0,
      certain: 0,
    },
    low: {
      rare: 0,
      unlikely: 0,
      moderate: 0,
      likely: 0,
      certain: 0,
    },
  }

  vulnerabilities.forEach((v) => {
    if (!v.severity && v.score) {
      if (v.score === 0) v.severity = SEVERITY.INFO
      else if (v.score <= 3.9) v.severity = SEVERITY.LOW
      else if (v.score <= 6.9) v.severity = SEVERITY.MEDIUM
      else if (v.score <= 8.9) v.severity = SEVERITY.HIGH
      else v.severity = SEVERITY.CRITICAL
    }
  })

  vulnerabilities.forEach((v) => {
    let likelihood = 0

    // CVSS Code weighting
    if (v.code) {
      const avIdxStart = v.code.search(/AV:[A-Z]/g)

      if (avIdxStart >= 0) {
        const av = v.code.substr(avIdxStart, 4)[3] // last char of "AV:N" which is "
        if (av === 'N') likelihood += 5
        else if (av === 'A') likelihood += 4
        else if (av === 'L') likelihood += 3
        else likelihood += 2
      } else {
        likelihood += 5
      }
    } else {
      likelihood += 5
    }

    // Severity weighting
    if (v.severity === 'critical') likelihood += 5
    else if (v.severity === 'high') likelihood += 4
    else if (v.severity === 'medium') likelihood += 3
    else likelihood += 2

    // Likelihood classification
    if (v.severity) {
      if (likelihood <= 2) likelihoods[v.severity].rare++
      else if (3 <= likelihood && likelihood <= 6)
        likelihoods[v.severity.toLowerCase()].unlikely++
      else if (7 <= likelihood && likelihood <= 10)
        likelihoods[v.severity.toLowerCase()].moderate++
      else if (11 <= likelihood && likelihood <= 14)
        likelihoods[v.severity.toLowerCase()].likely++
      else likelihoods[v.severity.toLowerCase()].certain++
    }
  })*/

  return { likelihoods }
}

const fetchScanHistory = async (params: any) => {
  const { companyId } = params
  try {
    const query = knex //knex('scan')
      .select({
        id: 'scan.id',
        sdate: 'cdate',
        status: 'scan.status',
        low: knex.raw(
          "count(vast.id) FILTER (WHERE LOWER(vast.severity) = 'low' or cvss.score <= 3.9)"
        ),
        medium: knex.raw(
          "count(vast.id) FILTER (WHERE LOWER(vast.severity) = 'medium' or (cvss.score <= 6.9 and cvss.score >= 4))"
        ),
        high: knex.raw(
          "count(vast.id) FILTER (WHERE LOWER(vast.severity) = 'high' or (cvss.score <= 8.9 and cvss.score >= 7))"
        ),
        critical: knex.raw(
          "count(vast.id) FILTER (WHERE LOWER(vast.severity) = 'critical' or cvss.score >= 9)"
        ),
      })
      .from('scan')
      .innerJoin({ cp: 'company' }, { 'cp.id': 'scan.company_id' })
      .innerJoin({ sa: 'scan_asset' }, { 'sa.scan_id': 'scan.id' })
      .innerJoin(
        { vast: 'vulnerability_asset' },
        { 'vast.id': 'sa.vulnerability_asset_id' }
      )
      .leftJoin('cvss', { 'cvss.id': 'vast.cvss_id' })
      .where({ 'cp.id': companyId })
      .groupBy('scan.id')
      .orderBy('cdate', 'desc')

    const scanHistory = await query

    if (Array.isArray(scanHistory)) {
      return { scanHistory }
    }

    return { error: MODEL_ERROR }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const fetchProjectAssignement = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId, id } = loggedUserInfo

    const projects = await prismaClient.v_remediation_project_summary_list.findMany(
      {
        where: {
          company_id: companyId,
          status: {
            in: ['open', 'in_progress', 'to_review', 'overdue'],
          },
          OR: [
            { owner_id: id },
            {
              remediation_project: {
                remediation_project_assignee: {
                  some: {
                    fk_user_id: id,
                  },
                },
              },
            },
          ],
        },
      }
    )

    const assignments = {
      owner: projects.filter((p: any) => p.owner_id === id),
      assignee: projects.filter((p: any) => p.owner_id !== id),
    }

    return { projectAssignement: assignments }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const fetchRiskPerAsset = async (params: any) => {
  if (!params.companyId)
    throw new Error(
      'Param "companyId" required to fetch company top vulnerabilities'
    )
  const query = knex
    .select({
      id: 'id',
      low: 'agg_sev.low',
      medium: 'agg_sev.medium',
      high: 'agg_sev.high',
      critical: 'agg_sev.critical',
    })
    .from('asset as ast')
    .where('ast.company_id', params.companyId)
  const sevSubquery = knex
    .select({
      asset_id: 'asset_id',
      low: knex.raw(
        "count(vast.id) filter (where LOWER(vast.severity) = 'low' or cvss.score <= 3.9)"
      ),
      medium: knex.raw(
        "count(vast.id) filter (where LOWER(vast.severity) = 'medium' or (cvss.score >= 4 and cvss.score <= 6.9))"
      ),
      high: knex.raw(
        "count(vast.id) filter (where LOWER(vast.severity) = 'high' or (cvss.score >= 7 and cvss.score <= 8.9))"
      ),
      critical: knex.raw(
        "count(vast.id) filter (where LOWER(vast.severity) = 'critical' or cvss.score >= 9)"
      ),
    })
    .from('vulnerability_asset as vast')
    .leftJoin('cvss', { 'cvss.id': 'vast.cvss_id' })
    .whereRaw(`status is NULL`)
    .orWhereRaw(`LOWER(status) = 'open'`)
    .groupBy('asset_id')
    .as('agg_sev')
  query.innerJoin(sevSubquery, { 'agg_sev.asset_id': 'ast.id' })
  const riskPerAsset = await query
  return { riskPerAsset }
}

const chartQueries = {
  severitiesSummary: fetchSeveritiesSummary,
  global: fetchGlobalRating,
  topVulnerabilities: fetchTopNVulnerabilities,
  likelihoods: fetchVulnerabilityLikelihoods,
  scanHistory: fetchScanHistory,
  projectAssignement: fetchProjectAssignement,
  riskPerAsset: fetchRiskPerAsset,
}

// ========================================================================

/**
 * Fetches a single dashboard chart data
 *
 * @param {ChartParams} params Params for fetching single chart data
 * @param {Express.LoggedUser} loggedUserInfo Params for fetching single chart data
 * @returns {Promise<object>} Data of a chart
 */
const fetchSingleChartData = async (params: any, loggedUserInfo: any) => {
  const { cid } = params

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (!chartQueries[cid]) throw new Error(`Invalid chart id: "${cid}"`)
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return await chartQueries[cid](params, loggedUserInfo)
}

/**
 * Fetches mulitple charts data
 *
 * @param {ChartParams} params Params to fetch multiple charts data
 * @returns {Promise<object>} Multiple charts data
 */
const fetchMultipleChartsData = async (params: any, loggedUserInfo: any) => {
  const { charts } = params
  let allChartsDataArr = []
  if (charts) {
    const chartIds = charts.split(',')
    allChartsDataArr = await Promise.all(
      chartIds
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        .map((id: any) => chartQueries[id]?.(params))
        .filter((query: any) => !!query)
    )
  } else {
    allChartsDataArr = await Promise.all(
      Object.values(chartQueries).map((queryFn) =>
        queryFn(params, loggedUserInfo)
      )
    )
  }

  return allChartsDataArr.reduce((allChartsData, chartData) => {
    const chartsData = {
      ...allChartsData,
      ...chartData,
    }
    return chartsData
  }, {})
}

/**
 * Model responsible of fetching one or multiple dashboard charts data
 *
 * @param {ChartParams} params Params to fetch one or multiple dashboard charts data
 * @returns {Promise<{error: string}|object>}
 */
export const chartsDataModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId, groups, roles } = loggedUserInfo
    const { cid } = params
    const chartParams = {
      ...params,
      companyId,
      groups,
      roles,
    }

    if (cid) {
      // Only 1 specific chart data
      return await fetchSingleChartData(chartParams, loggedUserInfo)
    }

    return await fetchMultipleChartsData(chartParams, loggedUserInfo)
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {string} userId
 */
export const fetchDashboard = async (userId: any) => {
  try {
    // 1) Fetch breakpoints & items
    const breakpoints = await prismaClient.dashboard_item.groupBy({
      by: ['breakpoint', 'breakpointwidth'],
      orderBy: { breakpoint: 'asc' },
    })
    const dashboardItems = await prismaClient.dashboard_item.findMany({
      select: {
        id: true,
        name: true,
        ckey: true,
        height: true,
        width: true,
        x: true,
        y: true,
        prop: true,
        breakpoint: true,
        breakpointwidth: true,
        dashboard_user: {
          where: {
            user_id: userId,
          },
        },
      },
    })

    // 2) Re-format items to match with old model
    const formattedDashboardItems = dashboardItems.map((item: any) => {
      const formatted = {
        id: item.id,
        breakpointWidth: item.breakpointwidth,
        name: item.name,
        ckey: item.ckey,
        defaultHeight: item.height,
        defaultWidth: item.width,
        defaultX: item.x,
        defaultY: item.y,
        prop: item.prop,
        breakpoint: item.breakpoint,
        userHeight: item.dashboard_user[0]?.height
          ? item.dashboard_user[0].height
          : null,
        userWidth: item.dashboard_user[0]?.width
          ? item.dashboard_user[0].width
          : null,
        userX: item.dashboard_user.length ? item.dashboard_user[0].x : null,
        userY: item.dashboard_user.length ? item.dashboard_user[0].y : null,
        visible: item.dashboard_user.length
          ? item.dashboard_user[0].visible
          : null,
      }
      return formatted
    })

    // 3) Save items in thei respective breakpoints
    for (const bp of breakpoints) {
      bp['items'] = formattedDashboardItems.filter(
        (item: any) => item.breakpoint === bp.breakpoint
      )
    }

    return { dashboard: breakpoints }
  } catch (error) {
    log.withError(error).error('fetchDashboard')
    return { error: MODEL_ERROR }
  }
}

export const updateDashboardUserModel = async (
  dashId: any,
  params: any,
  loggedUserInfo = {}
) => {
  try {
    // @ts-expect-error TS(2339): Property 'id' does not exist on type '{}'.
    const { id } = loggedUserInfo
    const {
      x = null,
      y = null,
      width = null,
      height = null,
      visible = true,
    } = params
    const [userDashItem] = await knex
      .select('*')
      .from('dashboard_user as d')
      .where({ 'd.user_id': id, 'd.dashboard_item_id': dashId })
    knex.transaction(async (tx: any) => {
      if (userDashItem) {
        await tx('dashboard_user')
          .update({
            x: x ?? userDashItem.x,
            y: y ?? userDashItem.y,
            width: width ?? userDashItem.width,
            height: height ?? userDashItem.height,
            visible: visible,
          })
          .where({
            'dashboard_user.user_id': id,
            'dashboard_user.dashboard_item_id': dashId,
          })
      } else {
        await tx('dashboard_user').insert({
          user_id: id,
          dashboard_item_id: dashId,
          x,
          y,
          width,
          height,
          visible,
        })
      }
    })
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
