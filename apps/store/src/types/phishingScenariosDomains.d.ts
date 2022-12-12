import { phishing_scenario_domain } from '@prisma/client'

export interface PhishingScenariosDomains extends phishing_scenario_domain {
  isAlreadySelected: boolean
}
