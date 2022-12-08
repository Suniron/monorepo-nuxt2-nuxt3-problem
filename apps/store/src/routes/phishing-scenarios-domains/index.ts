import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/phishing-scenari... Remove this comment to see the full error message
import { getPhishingScenariosDomains } from '@/controllers/phishing-scenarios-domains'

const router = express.Router()
router.get('/phishing-scenarios-domains', getPhishingScenariosDomains)

export default router
