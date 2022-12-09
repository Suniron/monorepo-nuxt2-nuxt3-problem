import { dashboardAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'

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
 * Service to fecth dashboard charts data
 *
 * @param {ChartParams} params Chart params to fetch data
 * @return {Promise<any>}
 */
export const chartsDataService = async (params, accessToken = '') => {
  const chartsData = await dashboardAPIs.getChartsData(params, accessToken)
  if (chartsData.error)
    return createServiceError(chartsData.error)
  const riskPerAsset = {
    emergency: 0,
    high: 0,
    low: 0,
    medium: 0,
    stateOfTheArt: 0,
  }
  let score = 0
  let count = 0
  for (const idx in chartsData.riskPerAsset) {
    const low = parseInt(chartsData.riskPerAsset[idx]?.low || 0)
    const medium = parseInt(chartsData.riskPerAsset[idx]?.medium || 0)
    const high = parseInt(chartsData.riskPerAsset[idx]?.high || 0)
    const critical = parseInt(chartsData.riskPerAsset[idx]?.critical || 0)
    const nbVuln = low + medium + high + critical
    const weight = low + 2 * medium + 3 * high + 4 * critical
    const moy = 100 - (weight / nbVuln) * 25
    score += moy
    count += 1
    if (moy <= 20)
      riskPerAsset.emergency += 1
    else if (moy <= 40)
      riskPerAsset.low += 1
    else if (moy <= 60)
      riskPerAsset.medium += 1
    else if (moy <= 80)
      riskPerAsset.high += 1
    else riskPerAsset.stateOfTheArt += 1
  }
  chartsData.riskPerAsset = riskPerAsset
  // - 5 => 0.5 or => 1
  if (count !== 0)
    chartsData.global = score / count
  else chartsData.global = 0

  if (chartsData.likelihoods) {
    chartsData.likelihoods = {
      critical: {
        certain: parseInt(chartsData.likelihoods.critical_almost_certain) || 0,
        likely: parseInt(chartsData.likelihoods.critical_likely) || 0,
        moderate: parseInt(chartsData.likelihoods.critical_moderate) || 0,
        rare: parseInt(chartsData.likelihoods.critical_rare) || 0,
        unlikely: parseInt(chartsData.likelihoods.critical_unlikely) || 0,
      },
      high: {
        certain: parseInt(chartsData.likelihoods.high_almost_certain) || 0,
        likely: parseInt(chartsData.likelihoods.high_likely) || 0,
        moderate: parseInt(chartsData.likelihoods.high_moderate) || 0,
        rare: parseInt(chartsData.likelihoods.high_rare) || 0,
        unlikely: parseInt(chartsData.likelihoods.high_unlikely) || 0,
      },
      low: {
        certain: parseInt(chartsData.likelihoods.low_almost_certain) || 0,
        likely: parseInt(chartsData.likelihoods.low_likely) || 0,
        moderate: parseInt(chartsData.likelihoods.low_moderate) || 0,
        rare: parseInt(chartsData.likelihoods.low_rare) || 0,
        unlikely: parseInt(chartsData.likelihoods.low_unlikely) || 0,
      },
      medium: {
        certain: parseInt(chartsData.likelihoods.medium_almost_certain) || 0,
        likely: parseInt(chartsData.likelihoods.medium_likely) || 0,
        moderate: parseInt(chartsData.likelihoods.medium_moderate) || 0,
        rare: parseInt(chartsData.likelihoods.medium_rare) || 0,
        unlikely: parseInt(chartsData.likelihoods.medium_unlikely) || 0,
      },
    }
  }
  return chartsData
}

export const fetchDashboardService = async (accessToken = '') => {
  const dashboard = await dashboardAPIs.fetchDashboard(accessToken)
  if (dashboard && 'error' in dashboard)
    return createServiceError(dashboard.error)

  const dashMap = elt => ({
    ckey: `${elt.ckey}-${Math.random().toString(36).substring(2, 7)}`,
    height: elt?.userHeight || elt.defaultHeight,
    id: elt.id,
    name: elt.name,
    prop: elt.prop,
    visible: elt.visible
      ? elt.visible
      : elt.visible === null
        ? true
        : elt.visible,
    width: elt?.userWidth || elt.defaultWidth,
    x: elt.userX === null ? elt.defaultX : elt.userX,
    y: elt.userY === null ? elt.defaultY : elt.userY,
  })
  return dashboard.map(elt => ({
    breakpoint: elt.breakpoint,
    breakpointWidth: elt.items[0].breakpointWidth,
    items: elt.items.map(dashMap),
  }))
}

export const updateDashboardUserService = async (
  id,
  params,
  accessToken = '',
) => {
  await dashboardAPIs.updateDashboardUser(id, params, accessToken)
}
