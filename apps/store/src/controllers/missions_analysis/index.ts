import { throwHTTPError } from '@/common/errors'
import {
  searchMissionAnalysis,
  searchBusinessImpact,
  updateBusinessImpactIntoUnitModel,
} from '@/models/missions_analysis'

export const searchMissionAnalysisController = async (req, res, next) => {
  try {
    const { mission, error } = await searchMissionAnalysis(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(mission)
  } catch (error) {
    next(error)
  }
}

export const searchBusinessImpactController = async (req, res, next) => {
  try {
    const { businessImpact, error } = await searchBusinessImpact(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(businessImpact)
  } catch (error) {
    next(error)
  }
}
export const updateBusinessImpactIntoUnit = async (req, res, next) => {
  try {
    const { error } = await updateBusinessImpactIntoUnitModel(
      req.body,
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
