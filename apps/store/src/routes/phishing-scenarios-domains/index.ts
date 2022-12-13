import express from 'express'

import { getPhishingScenariosDomains } from '../../controllers/phishing-scenarios-domains'

const router = express.Router()
router.get('/phishing-scenarios-domains', getPhishingScenariosDomains)

export default router
