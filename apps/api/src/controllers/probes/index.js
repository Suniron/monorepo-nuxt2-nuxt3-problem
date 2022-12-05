import { throwHTTPError } from '@/common/errors'
import { searchProbesService, updateProbesService } from '@/services/probes'

export const searchProbesController = async (req, res, next) => {
  try {
    const { data } = await searchProbesService(
      {
        ...(req.params || {}),
      },
      req.accessToken
    )

    if (data.error) throwHTTPError(data.error)

    res.send({ data })
  } catch (error) {
    next(error)
  }
}

export const updateProbesController = async (req, res, next) => {
  try {
    const data = await updateProbesService(
      {
        ...(req.params || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)

    res.sendStatus(data.status)
  } catch (error) {
    next(error)
  }
}
