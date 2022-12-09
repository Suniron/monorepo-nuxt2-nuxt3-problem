import express from 'express'
import {
  createVulnerabilityController,
  searchVulnerabilitiesController,
  searchVulnerabilitiesWithTheirAssetsController,
} from '@/controllers/vulnerabilities'

const router = express.Router()

router.get('/vulnerabilities', searchVulnerabilitiesController)
router.get(
  '/vulnerabilities/assets',
  searchVulnerabilitiesWithTheirAssetsController,
)
router.post('/vulnerabilities', createVulnerabilityController)
router.get('/vulnerabilities/:vid', searchVulnerabilitiesController)
router.get(
  '/vulnerabilities/:vid/assets',
  searchVulnerabilitiesWithTheirAssetsController,
)

export default router
