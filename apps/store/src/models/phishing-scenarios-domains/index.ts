// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, NOT_FOUND } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'

/**
 * Returns a list of domains used during phishing scenarios.
 *
 * @returns {Promise<{data?: import('@/types/phishingScenariosDomains').PhishingScenariosDomains[], error?: string, message?: string }>}
 */

export const getPhishingScenariosDomainsModel = async (loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
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
      data: phishingScenariosDomains.map((psd: any) => ({
        ...psd,

        isAlreadySelected:
          psd.id === selectedDomain?.fk_phishing_scenario_domain_id
      })),
    };
  } catch (error) {
    return { error: MODEL_ERROR }
  }
}
