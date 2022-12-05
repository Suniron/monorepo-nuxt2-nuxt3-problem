import { getAvailableTransitionsService } from '@/services/project-statuses'
import { throwHTTPError } from '@/common/errors'

export const getAvailableTransitionsController = async (req, res, next) => {
  try {
    const data = await getAvailableTransitionsService(
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
