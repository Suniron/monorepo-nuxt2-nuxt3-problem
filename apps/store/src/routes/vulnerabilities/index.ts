import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  searchVulnerabilitiesController,
  searchVulnerabilitiesWithTheirAssetsController,
  createVulnerabilityController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/vulnerabilities'... Remove this comment to see the full error message
} from '@/controllers/vulnerabilities'

const router = express.Router()

const searchVulnerabilityByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    vid: Joi.number().required(),
  }),
})

router.get('/vulnerabilities', searchVulnerabilitiesController)
router.get(
  '/vulnerabilities/assets',
  searchVulnerabilitiesWithTheirAssetsController
)
router.post('/vulnerabilities', createVulnerabilityController)
router.get(
  '/vulnerabilities/:vid/assets',
  searchVulnerabilityByIdValidation,
  searchVulnerabilitiesWithTheirAssetsController
)
router.get(
  '/vulnerabilities/:vid',
  searchVulnerabilityByIdValidation,
  searchVulnerabilitiesController
)

export default router
