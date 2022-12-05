import { throwHTTPError } from '@/common/errors'
import { generateService } from '@/services/reports'

export const generateController = async (req, res, next) => {
  try {
    const result = await generateService(req.accessToken)
    if (result.error) throwHTTPError(result.error)
    res.status(201).send({ docx: result })
  } catch (error) {
    next(error)
  }
}
