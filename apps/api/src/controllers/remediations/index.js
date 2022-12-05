import { searchGroupedRemediationsService } from '@/services/remediations'
import { throwHTTPError } from '@/common/errors'

export const searchGroupedRemediationsController = async (req, res, next) => {
  try {
    const data = await searchGroupedRemediationsService(
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
