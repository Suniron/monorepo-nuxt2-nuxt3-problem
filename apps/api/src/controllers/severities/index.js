import {
  searchSeveritiesService,
  updateSeveritiesService,
} from '@/services/severities'
import { throwHTTPError } from '@/common/errors'

export const searchSeveritiesController = async (req, res, next) => {
  try {
    const data = await searchSeveritiesService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const updateSeveritiesController = async (req, res, next) => {
  try {
    const data = await updateSeveritiesService(
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
