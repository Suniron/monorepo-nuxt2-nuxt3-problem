import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createVulnerabilityController,
  searchVulnerabilitiesController,
  searchVulnerabilitiesWithTheirAssetsController,
} from '../../controllers/vulnerabilities'

const router = Router()

const searchVulnerabilityByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    vid: Joi.number().required(),
  }),
})

router.get('/vulnerabilities', searchVulnerabilitiesController)
router.get(
  '/vulnerabilities/assets',
  searchVulnerabilitiesWithTheirAssetsController,
)
router.post('/vulnerabilities', createVulnerabilityController)
router.get(
  '/vulnerabilities/:vid/assets',
  searchVulnerabilityByIdValidation,
  searchVulnerabilitiesWithTheirAssetsController,
)
router.get(
  '/vulnerabilities/:vid',
  searchVulnerabilityByIdValidation,
  searchVulnerabilitiesController,
)

export default router
