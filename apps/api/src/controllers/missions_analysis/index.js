import { throwHTTPError } from '@/common/errors'

import {
  searchMissionAnalysisService,
  searchBusinessImpactService,
  updateBusinessImpactService,
} from '@/services/missions_analysis'

export const searchMissionAnalysis = async (req, res, next) => {
  try {
    const data = await searchMissionAnalysisService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    data.units.forEach((unit) => {
      unit.fearedEvents.sort((a, b) => a.name.localeCompare(b.name))
    })
    res.send(data)
  } catch (error) {
    next(error)
  }
}
export const searchBusinessImpact = async (req, res, next) => {
  try {
    const data = await searchBusinessImpactService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const updateBusinessImpactIntoUnit = async (req, res, next) => {
  try {
    const data = await updateBusinessImpactService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    res.send(data)
  } catch (error) {
    next(error)
  }
}
