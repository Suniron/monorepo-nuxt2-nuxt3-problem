import { throwHTTPError } from '@/common/errors'
import { getPhishingScenariosDomainsModel } from '@/models/phishing-scenarios-domains'

export const getPhishingScenariosDomains = async (req, res, next) => {
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
