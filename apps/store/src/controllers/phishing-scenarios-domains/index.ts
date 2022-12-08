// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/models/phishing-scenarios-do... Remove this comment to see the full error message
import { getPhishingScenariosDomainsModel } from '@/models/phishing-scenarios-domains'

export const getPhishingScenariosDomains = async (req: any, res: any, next: any) => {
  try {
    const { data, error, message } = await getPhishingScenariosDomainsModel(
      req.user
    )

    if (error) throwHTTPError(error, message)
    res.send(data)
  } catch (error) {
    next(error)
  }
}
