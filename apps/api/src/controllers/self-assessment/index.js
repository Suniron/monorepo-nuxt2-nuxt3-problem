import { throwHTTPError } from '@/common/errors'
import { fetchComplianceService } from '@/services/self-assessment'

export const fetchComplianceController = async (req, res, next) => {
  try {
    const result = await fetchComplianceService(req.query, req.accessToken)

    if (result?.error) throwHTTPError(result.error)

    res.status(201).send(result)
  } catch (error) {
    next(error)
  }
}
