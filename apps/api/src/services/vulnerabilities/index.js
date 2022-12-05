import { assetsAPIs, vulnerabilitiesAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { VALIDATION_ERROR, SUCCESS } from '@/common/constants'
import { log } from '@/lib/logger'

export const getAssetVulnerabilitiesService = async (
  assetId,
  params,
  accessToken = ''
) => {
  const {
    error,
    vulnerabilities,
    total,
  } = await assetsAPIs.searchAssetVulnerabilities(assetId, params, accessToken)
  if (error) return createServiceError(error)

  const formatVulnerability = (vulnerability) => ({
    assetVulnerabilityId: vulnerability.asset_vulnerability_id,
    vulnerabilityId: vulnerability.vulnerability_id,
    name: vulnerability.name,
    description: vulnerability.description,
    remediation: vulnerability.remediation,
    insight: vulnerability.insight,
    affected: vulnerability.affected,
    vulndetect: vulnerability.vulndetect,
    details: vulnerability.details,
    cvss: {
      code: vulnerability.cvss_code,
      score: vulnerability.cvss_score,
    },
    severity: vulnerability.severity,
    confidence: vulnerability.confidence,
    likelihood: vulnerability.likelihood,
    port: vulnerability.port,
    proto: vulnerability.proto,
    status: vulnerability.status,
    refs: vulnerability.references
      ? vulnerability.references.filter((elt) => elt.type === 'url')
      : null,
    cves: vulnerability.references
      ? vulnerability.references.filter((elt) => elt.type === 'cve')
      : null,
  })
  return {
    vulnerabilities: vulnerabilities.map(formatVulnerability),
    total,
  }
}
export const updatePortForVulnerabilities = async (
  body,
  params,
  accessToken = ''
) => {
  const response = await assetsAPIs.updatePortVuln(body, params, accessToken)
  return response !== 'Changements effectués'
    ? createServiceError(error)
    : { status: SUCCESS }
}

export const deleteForVulnerabilities = async (
  body,
  params,
  accessToken = ''
) => {
  const response = await assetsAPIs.deleteVuln(body, params, accessToken)
  return response !== 'Suppression effectués'
    ? createServiceError(error)
    : { status: SUCCESS }
}

export const updateStatusService = async (
  aid,
  vid,
  params,
  accessToken = ''
) => {
  if (!vid || !aid) return { error: VALIDATION_ERROR }
  if (!params || !Object.entries(params).length) return { status: SUCCESS } // nothing to update

  const { error, status } = await assetsAPIs.updateStatus(
    aid,
    vid,
    params,
    accessToken
  )
  return error ? createServiceError(error) : { status: SUCCESS }
}

export const addPostVulnerabilityAssetService = async (
  aid,
  vid,
  params,
  accessToken = ''
) => {
  if (!vid || !aid) return { error: VALIDATION_ERROR }
  if (!params || !Object.entries(params).length) return { status: SUCCESS } // nothing to update

  const { error, status } = await assetsAPIs.addPostVulnerabilityAsset(
    aid,
    vid,
    params,
    accessToken
  )
  return error ? createServiceError(error) : { status: SUCCESS }
}

export const searchPostVulnerabilityAssetService = async (
  aid,
  vid,
  accessToken = ''
) => {
  if (!vid || !aid) return { error: VALIDATION_ERROR }

  const {
    error,
    comments,
    total,
  } = await assetsAPIs.searchPostVulnerabilityAsset(aid, vid, accessToken)

  return error
    ? createServiceError(error)
    : { comments: comments, total: total }
}

export const searchVulnerabilitiesService = async (
  params,
  accessToken = ''
) => {
  const { vid, search, severities, likelihoods } = params
  const {
    error,
    vulnerability,
    vulnerabilities,
    total,
  } = await vulnerabilitiesAPIs.searchVulnerabilities(
    {
      vid,
      search,
      severities,
      likelihoods,
    },
    accessToken
  )

  if (error) return createServiceError(error)

  const formatVulnerability = (vuln) => {
    const v = {
      id: vuln.id,
      oid: vuln.oid,
      burpId: vuln.burp_id,
      name: vuln.name,
      description: vuln.description,
      remediation: vuln.remediation,
      insight: vuln.insight,
      affected: vuln.affected,
      vulndetect: vuln.vulndetect,
      affectedAssets: vuln.affected_assets,
    }

    return v
  }

  return vulnerability
    ? { vulnerability: formatVulnerability(vulnerability) }
    : {
        vulnerabilities: vulnerabilities.map(formatVulnerability),
        total,
      }
}

export const searchVulnerabilitiesWithTheirAssetsService = async (
  params,
  accessToken = ''
) => {
  const {
    error,
    vulnerability,
    vulnerabilities,
    total,
  } = await vulnerabilitiesAPIs.searchVulnerabilitiesWithTheirAssets(
    params,
    accessToken
  )

  if (error) return createServiceError(error)

  return vulnerability
    ? { vulnerability: vulnerability }
    : {
        vulnerabilities: vulnerabilities,
        total,
      }
}

export const createVulnerabilityService = async (params, accessToken = '') => {
  const { urls = [], cves = [] } = params
  const refs = urls
    .reduce((arr, e) => arr.concat([{ type: 'url', value: e }]), [])
    .concat(
      cves.reduce((arr, e) => arr.concat([{ type: 'cve', value: e }]), [])
    )
  params.refs = refs
  log.debug('createVulnerabilityService ' + JSON.stringify(params))
  const id = await vulnerabilitiesAPIs.createVulnerability(params, accessToken)
  return id
}
