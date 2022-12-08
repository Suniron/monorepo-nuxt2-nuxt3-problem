// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/models/probes' or its corres... Remove this comment to see the full error message
import { searchProbesModel, updateProbeModel } from '@/models/probes'

export const searchProbesController = async (req: any, res: any, next: any) => {
  try {
    const { error, probes } = await searchProbesModel(
      {
        ...(req.params || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(probes)
  } catch (error) {
    next(error)
  }
}

export const updateProbeController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await updateProbeModel(
      {
        ...(req.params || {}),
      },
      req.body,
      req.user
    )

    if (error) throwHTTPError(error)

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
