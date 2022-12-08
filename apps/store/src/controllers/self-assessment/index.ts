// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/models/self-assessment' or i... Remove this comment to see the full error message
import { fetchCompliance } from '@/models/self-assessment'

export const fetchComplianceController = async (req: any, res: any) => {
  try {
    const results = await fetchCompliance(req.query, req.user)
    if ('error' in results) throwHTTPError(results.error)
    res.status(201).send(results)
  } catch (error) {
    throwHTTPError(error)
  }
}
