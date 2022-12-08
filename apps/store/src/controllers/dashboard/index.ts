// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError, throwValidationError } from '@/common/errors'
import {
  chartsDataModel,
  fetchDashboard,
  updateDashboardUserModel,
// @ts-expect-error TS(2307): Cannot find module '@/models/dashboard' or its cor... Remove this comment to see the full error message
} from '@/models/dashboard'

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
      req.user
    )
    if (chartDataResult.error) throwHTTPError(chartDataResult.error)

    const chartIdsResultMap = {
      severitiesSummary: 'severitiesSummary',
      global: 'global',
      topVulnerabilities: 'topVulnerabilities',
      likelihoods: 'likelihoods',
      scanHistory: 'scanHistory',
      projectAssignement: 'projectAssignement',
      riskPerAsset: 'riskPerAsset',
    }

    if (req.query?.cid) {
      const { cid } = req.query

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (!chartIdsResultMap[cid]) throwValidationError({})
      return res.send({
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        [chartIdsResultMap[cid]]: chartDataResult[chartIdsResultMap[cid]],
      })
    }

    res.send(
      Object.values(chartIdsResultMap).reduce((hash, resultProp) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        hash[resultProp] = chartDataResult[resultProp]
        return hash
      }, {})
    )
  } catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const fetchDashboardController = async (req: any, res: any, next: any) => {
  try {
    const { error, dashboard } = await fetchDashboard(req.user.id)
    if (error) {
      return throwHTTPError(error)
    }

    res.send({ dashboard })
  } catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateDashboardUserController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await updateDashboardUserModel(
      req.params.dashId,
      req.body,
      req.user
    )
    if (error) return throwHTTPError(error)
    res.send()
  } catch (error) {
    next(error)
  }
}
