import { throwHTTPError } from '@/common/errors'
import {
  getAssetVulnerabilitiesService,
  updateStatusService,
  searchVulnerabilitiesService,
  searchVulnerabilitiesWithTheirAssetsService,
  searchPostVulnerabilityAssetService,
  addPostVulnerabilityAssetService,
  createVulnerabilityService,
  updatePortForVulnerabilities,
  deleteForVulnerabilities,
} from '@/services/vulnerabilities'

export const assetVulnerabilitiesController = async (req, res, next) => {
  try {
    const {
      error,
      vulnerabilities,
      total,
    } = await getAssetVulnerabilitiesService(
      req.params?.id,
      req.query,
      req.accessToken
    )
    if (error) throwHTTPError(error)
    vulnerabilities.forEach((e) => {
      e.details?.sort((a, b) => {
        return (
          new Date(b.vuln_publication_date) - new Date(a.vuln_publication_date)
        )
      })
    })
    vulnerabilities.sort(function (a, b) {
      if (
        b?.details[0]?.vuln_publication_date !== undefined &&
        a?.details[0]?.vuln_publication_date !== undefined
      ) {
        return (
          new Date(b.details[0].vuln_publication_date) -
          new Date(a.details[0].vuln_publication_date)
        )
      }
    })
    res.send({ vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}
export const updatePortInVulnerabilities = async (req, res, next) => {
  try {
    const data = await updatePortForVulnerabilities(
      req.body,
      req.params,
      req.accessToken
    )
    data.status === 'SUCCESS'
      ? res.status(200).send('Changements effectués')
      : res.status(418)
  } catch (error) {
    next(error)
  }
}
export const deleteVulnerabilities = async (req, res, next) => {
  try {
    const data = await deleteForVulnerabilities(
      req.body,
      req.params,
      req.accessToken
    )
    data.status === 'SUCCESS'
      ? res.status(200).send('Suppression effectués')
      : res.status(418)
  } catch (error) {
    next(error)
  }
}

export const searchVulnerabilitiesController = async (req, res, next) => {
  try {
    const {
      error,
      vulnerability,
      vulnerabilities,
      total,
    } = await searchVulnerabilitiesService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.send(vulnerability || { vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}

export const searchVulnerabilitiesWithTheirAssetsController = async (
  req,
  res,
  next
) => {
  try {
    const {
      error,
      vulnerability,
      vulnerabilities,
      total,
    } = await searchVulnerabilitiesWithTheirAssetsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.send(vulnerability || { vulnerabilities, total })
  } catch (error) {
    next(error)
  }
}

export const updateStatusController = async (req, res, next) => {
  try {
    const { error, status } = await updateStatusService(
      req.params?.aid,
      req.params?.vid,
      req.body,
      req.accessToken
    )
    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const addPostVulnerabilityAssetController = async (req, res, next) => {
  try {
    const { error, status } = await addPostVulnerabilityAssetService(
      req.params?.aid,
      req.params?.vid,
      req.body,
      req.accessToken
    )
    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

export const searchPostVulnerabilityAssetController = async (
  req,
  res,
  next
) => {
  try {
    const {
      error,
      comments,
      total,
    } = await searchPostVulnerabilityAssetService(
      req.params?.aid,
      req.params?.vid,
      req.accessToken
    )
    if (error) throwHTTPError(error)

    res.send({ comments, total })
  } catch (error) {
    next(error)
  }
}

export const createVulnerabilityController = async (req, res, next) => {
  try {
    const id = await createVulnerabilityService(req.body, req.accessToken)
    if (id.error) throwHTTPError(id.error)
    res.send(id)
  } catch (error) {
    next(error)
  }
}
