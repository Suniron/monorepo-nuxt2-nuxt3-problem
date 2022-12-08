// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
import {
  searchMissionAnalysis,
  searchBusinessImpact,
  updateBusinessImpactIntoUnitModel,
// @ts-expect-error TS(2307): Cannot find module '@/models/missions_analysis' or... Remove this comment to see the full error message
} from '@/models/missions_analysis'

export const searchMissionAnalysisController = async (req: any, res: any, next: any) => {
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

export const searchBusinessImpactController = async (req: any, res: any, next: any) => {
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
export const updateBusinessImpactIntoUnit = async (req: any, res: any, next: any) => {
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
