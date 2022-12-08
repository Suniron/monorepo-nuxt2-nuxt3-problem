import { throwHTTPError } from '@/common/errors'
import { fetchCompliance } from '@/models/self-assessment'

export const fetchComplianceController = async (req, res) => {
  try {
    const results = await fetchCompliance(req.query, req.user)
    if ('error' in results) throwHTTPError(results.error)
    res.status(201).send(results)
  } catch (error) {
    throwHTTPError(error)
  }
}
