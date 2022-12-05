import { throwHTTPError } from '@/common/errors'
import { updateFearedEventsService } from '@/services/fearedEvents'

export const updateFearedEventsController = async (req, res, next) => {
  try {
    const data = await updateFearedEventsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}
