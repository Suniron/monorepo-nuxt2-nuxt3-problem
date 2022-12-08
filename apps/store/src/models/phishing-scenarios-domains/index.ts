// @ts-check
import { MODEL_ERROR, NOT_FOUND } from '@/common/constants'
import prismaClient from '@/prismaClient'

/**
 * Returns a list of domains used during phishing scenarios.
 *
 * @returns {Promise<{data?: import('@/types/phishingScenariosDomains').PhishingScenariosDomains[], error?: string, message?: string }>}
 */

export const getPhishingScenariosDomainsModel = async (loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const selectedDomain = await prismaClient.company.findFirst({
      select: {
        fk_phishing_scenario_domain_id: true,
      },
      where: {
        id: companyId,
      },
    })

    const phishingScenariosDomains = await prismaClient.phishing_scenario_domain.findMany()
    if (!phishingScenariosDomains) {
      return {
        error: NOT_FOUND,
        message: 'No phishing scenarios domains found in database',
      }
    }

    return {
      data: phishingScenariosDomains.map((psd) => ({
        ...psd,
        isAlreadySelected:
          psd.id === selectedDomain?.fk_phishing_scenario_domain_id,
      })),
    }
  } catch (error) {
    return { error: MODEL_ERROR }
  }
}
