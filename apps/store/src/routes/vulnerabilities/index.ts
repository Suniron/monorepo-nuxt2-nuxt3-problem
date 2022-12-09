import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  searchVulnerabilitiesController,
  searchVulnerabilitiesWithTheirAssetsController,
  createVulnerabilityController,

} from '../../controllers/vulnerabilities'

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
