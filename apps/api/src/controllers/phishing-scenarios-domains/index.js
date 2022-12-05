import { throwHTTPError } from '@/common/errors'
import { getPhishingScenariosDomainsService } from '@/services/phishing-scenarios-domains'

export const getPhishingScenariosDomains = async (req, res, next) => {
  try {
    const { error, data } = await getPhishingScenariosDomainsService(
      {
        ...(req.params || {}),
      },
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.send({ data })
  } catch (error) {
    next(error)
  }
}
