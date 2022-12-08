// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/models/reports' or its corre... Remove this comment to see the full error message
import { generateModel } from '@/models/reports'

export const generateController = async (req: any, res: any, next: any) => {
  try {
    const { error, vast } = await generateModel(req.user)

    if (error) throwHTTPError(error)

    res.status(201).send({ vast: vast })
  } catch (error) {
    next(error)
  }
}
