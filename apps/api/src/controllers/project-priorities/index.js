import { searchProjectPrioritiesService } from '@/services/project-priorities'
import { throwHTTPError } from '@/common/errors'

export const searchProjectPrioritiesController = async (req, res, next) => {
  try {
    const data = await searchProjectPrioritiesService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )
    if (data.error)
      throwHTTPError(data.error)
    res.send(data)
  }
  catch (error) {
    next(error)
  }
}
