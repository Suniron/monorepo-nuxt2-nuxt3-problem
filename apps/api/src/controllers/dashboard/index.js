import { throwHTTPError, throwValidationError } from '@/common/errors'
import {
  chartsDataService,
  fetchDashboardService,
  updateDashboardUserService,
} from '@/services/dashboard'

export const chartsDataController = async (req, res, next) => {
  try {
    const chartsDataResult = await chartsDataService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )
    if (chartsDataResult.error)
      throwHTTPError(chartsDataResult.error)

    const chartIdsResultMap = {
      global: 'global',
      likelihoods: 'likelihoods',
      projectAssignement: 'projectAssignement',
      riskPerAsset: 'riskPerAsset',
      scanHistory: 'scanHistory',
      severitiesSummary: 'severitiesSummary',
      topVulnerabilities: 'topVulnerabilities',
    }

    if (req.query?.cid) {
      const { cid } = req.query

      if (!chartIdsResultMap[cid])
        throwValidationError()
      return res.send({
        [chartIdsResultMap[cid]]: chartsDataResult[chartIdsResultMap[cid]],
      })
    }

    res.send(
      Object.values(chartIdsResultMap).reduce((hash, resultProp) => {
        hash[resultProp] = chartsDataResult[resultProp]
        return hash
      }, {}),
    )
  }
  catch (error) {
    next(error)
  }
}

export const fetchDashboardController = async (req, res, next) => {
  try {
    const dashboards = await fetchDashboardService(req.accessToken)
    if (dashboards?.error)
      throwHTTPError(dashboards.error)
    res.send({ dashboards })
  }
  catch (error) {
    next(error)
  }
}

export const updateDashboardUserController = async (req, res, next) => {
  try {
    await updateDashboardUserService(req.params.id, req.body, req.accessToken)
    res.send()
  }
  catch (error) {
    next(error)
  }
}
