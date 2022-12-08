// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/models/ips' or its correspon... Remove this comment to see the full error message
import { deleteIpModel, updateIpModel, createIpModel } from '@/models/ips'

export const deleteIpController = async (req: any, res: any, next: any) => {
  try {
    const { status, error } = await deleteIpModel(req.params?.id)

    if (error) throwHTTPError(error)

    res.status(204).send(status)
  } catch (error) {
    next(error)
  }
}

export const updateIpController = async (req: any, res: any, next: any) => {
  try {
    const { status, error } = await updateIpModel(req.body, req.params.id)

    if (error) throwHTTPError(error)

    res.status(204).send(status)
  } catch (error) {
    next(error)
  }
}

export const createIpController = async (req: any, res: any, next: any) => {
  try {
    const { ipId, error } = await createIpModel(req.params.assetId, req.body)

    if (error) throwHTTPError(error)

    res.status(201).send({ ipId })
  } catch (error) {
    next(error)
  }
}
