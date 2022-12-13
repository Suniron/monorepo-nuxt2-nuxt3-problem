import { throwHTTPError, throwValidationError } from '../../common/errors'
import {
  chartsDataModel,
  fetchDashboard,
  updateDashboardUserModel,
} from '../../models/dashboard'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const chartsDataController = async (req: any, res: any, next: any) => {
  try {
    const chartDataResult = await chartsDataModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user,
    )
    if (chartDataResult.error)
      throwHTTPError(chartDataResult.error)

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
        throwValidationError({})
      return res.send({
        [chartIdsResultMap[cid]]: chartDataResult[chartIdsResultMap[cid]],
      })
    }

    res.send(
      Object.values(chartIdsResultMap).reduce((hash, resultProp) => {
        hash[resultProp] = chartDataResult[resultProp]
        return hash
      }, {}),
    )
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const fetchDashboardController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, dashboard } = await fetchDashboard(req.user.id)
    if (error)
      return throwHTTPError(error)

    res.send({ dashboard })
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateDashboardUserController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error } = await updateDashboardUserModel(
      req.params.dashId,
      req.body,
      req.user,
    )
    if (error)
      return throwHTTPError(error)
    res.send()
  }
  catch (error) {
    next(error)
  }
}
