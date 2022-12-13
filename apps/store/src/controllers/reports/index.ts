import { throwHTTPError } from '../../common/errors'

import { generateModel } from '../../models/reports'

export const generateController = async (req: any, res: any, next: any) => {
  try {
    const { error, vast } = await generateModel(req.user)

    if (error)
      throwHTTPError(error)

    res.status(201).send({ vast })
  }
  catch (error) {
    next(error)
  }
}
