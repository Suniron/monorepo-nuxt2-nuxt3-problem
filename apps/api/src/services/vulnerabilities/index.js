import { assetsAPIs, vulnerabilitiesAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { log } from '@/lib/logger'

export const getAssetVulnerabilitiesService = async (
  assetId,
  params,
  accessToken = '',
) => {
  const {
    error,
    vulnerabilities,
    total,
  } = await assetsAPIs.searchAssetVulnerabilities(assetId, params, accessToken)
  if (error)
    return createServiceError(error)

  const formatVulnerability = vulnerability => ({
    affected: vulnerability.affected,
    assetVulnerabilityId: vulnerability.asset_vulnerability_id,
    confidence: vulnerability.confidence,
    cves: vulnerability.references
      ? vulnerability.references.filter(elt => elt.type === 'cve')
      : null,
    cvss: {
      code: vulnerability.cvss_code,
      score: vulnerability.cvss_score,
    },
    description: vulnerability.description,
    details: vulnerability.details,
    insight: vulnerability.insight,
    likelihood: vulnerability.likelihood,
    name: vulnerability.name,
    port: vulnerability.port,
    proto: vulnerability.proto,
    refs: vulnerability.references
      ? vulnerability.references.filter(elt => elt.type === 'url')
      : null,
    remediation: vulnerability.remediation,
    severity: vulnerability.severity,
    status: vulnerability.status,
    vulndetect: vulnerability.vulndetect,
    vulnerabilityId: vulnerability.vulnerability_id,
  })
  return {
    total,
    vulnerabilities: vulnerabilities.map(formatVulnerability),
  }
}
export const updatePortForVulnerabilities = async (
  body,
  params,
  accessToken = '',
) => {
  const response = await assetsAPIs.updatePortVuln(body, params, accessToken)
  return response !== 'Changements effectués'
    ? createServiceError(error)
    : { status: SUCCESS }
}

export const deleteForVulnerabilities = async (
  body,
  params,
  accessToken = '',
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
  accessToken = '',
) => {
  if (!vid || !aid)
    return { error: VALIDATION_ERROR }
  if (!params || !Object.entries(params).length)
    return { status: SUCCESS } // nothing to update

  const { error, status } = await assetsAPIs.updateStatus(
    aid,
    vid,
    params,
    accessToken,
  )
  return error ? createServiceError(error) : { status: SUCCESS }
}

export const addPostVulnerabilityAssetService = async (
  aid,
  vid,
  params,
  accessToken = '',
) => {
  if (!vid || !aid)
    return { error: VALIDATION_ERROR }
  if (!params || !Object.entries(params).length)
    return { status: SUCCESS } // nothing to update

  const { error, status } = await assetsAPIs.addPostVulnerabilityAsset(
    aid,
    vid,
    params,
    accessToken,
  )
  return error ? createServiceError(error) : { status: SUCCESS }
}

export const searchPostVulnerabilityAssetService = async (
  aid,
  vid,
  accessToken = '',
) => {
  if (!vid || !aid)
    return { error: VALIDATION_ERROR }

  const {
    error,
    comments,
    total,
  } = await assetsAPIs.searchPostVulnerabilityAsset(aid, vid, accessToken)

  return error
    ? createServiceError(error)
    : { comments, total }
}

export const searchVulnerabilitiesService = async (
  params,
  accessToken = '',
) => {
  const { vid, search, severities, likelihoods } = params
  const {
    error,
    vulnerability,
    vulnerabilities,
    total,
  } = await vulnerabilitiesAPIs.searchVulnerabilities(
    {
      likelihoods,
      search,
      severities,
      vid,
    },
    accessToken,
  )

  if (error)
    return createServiceError(error)

  const formatVulnerability = (vuln) => {
    const v = {
      affected: vuln.affected,
      affectedAssets: vuln.affected_assets,
      burpId: vuln.burp_id,
      description: vuln.description,
      id: vuln.id,
      insight: vuln.insight,
      name: vuln.name,
      oid: vuln.oid,
      remediation: vuln.remediation,
      vulndetect: vuln.vulndetect,
    }

    return v
  }

  return vulnerability
    ? { vulnerability: formatVulnerability(vulnerability) }
    : {
        total,
        vulnerabilities: vulnerabilities.map(formatVulnerability),
      }
}

export const searchVulnerabilitiesWithTheirAssetsService = async (
  params,
  accessToken = '',
) => {
  const {
    error,
    vulnerability,
    vulnerabilities,
    total,
  } = await vulnerabilitiesAPIs.searchVulnerabilitiesWithTheirAssets(
    params,
    accessToken,
  )

  if (error)
    return createServiceError(error)

  return vulnerability
    ? { vulnerability }
    : {
        total,
        vulnerabilities,
      }
}

export const createVulnerabilityService = async (params, accessToken = '') => {
  const { urls = [], cves = [] } = params
  const refs = urls
    .reduce((arr, e) => arr.concat([{ type: 'url', value: e }]), [])
    .concat(
      cves.reduce((arr, e) => arr.concat([{ type: 'cve', value: e }]), []),
    )
  params.refs = refs
  log.debug(`createVulnerabilityService ${JSON.stringify(params)}`)
  const id = await vulnerabilitiesAPIs.createVulnerability(params, accessToken)
  return id
}
