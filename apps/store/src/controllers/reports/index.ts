import { throwHTTPError } from '@/common/errors'
import { generateModel } from '@/models/reports'

export const generateController = async (req, res, next) => {
  try {
    const { error, vast } = await generateModel(req.user)

    if (error) throwHTTPError(error)

    res.status(201).send({ vast: vast })
  } catch (error) {
    next(error)
  }
}
