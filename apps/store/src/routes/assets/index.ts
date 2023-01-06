import { Router } from 'express'
import { Joi, Segments, celebrate, errors } from 'celebrate'
import {
  createAssetController,
  createAssetVulnerabilityController,
  deleteAssetController,
  deleteAssetsBulkController,
  fetchAssetPortsController,
  getAssetRiskController,
  getAssetsSummaryController,
  importCSVController,
  searchAssetRevisionsController,
  searchAssetsBelongingController,
  searchAssetsController,
  updateAssetController,
  updateAssetsBulkController,
} from '../../controllers/assets'
import {
  addPostAssetVulnerabilityController,
  assetVulnerabilitiesController,
  deleteVulnerabilitiesAssetController,
  searchPostAssetVulnerabilityController,
  updateStatusController,
  updateVulnerabilitiesAssetController,
} from '../../controllers/vulnerabilities'

// Validations
const vulnerabilityStatusUpdatePayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    comment: Joi.string().allow('').required(),
    updated: Joi.string().required().lowercase(),
  }),
})

const assetIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().required(),
  }),
})

const router = Router()
// Assets endpoints
router.get('/assets', searchAssetsController)
router.delete('/assets', deleteAssetsBulkController)
router.patch('/assets', updateAssetsBulkController)
router.post('/assets', createAssetController)
router.post('/assets/importCSV', importCSVController)
router.get('/assets/summary', getAssetsSummaryController)
router.get('/assets/belonging', searchAssetsBelongingController)
router.get('/assets/:id', searchAssetsController)
router.patch('/assets/:id', updateAssetController)
router.delete('/assets/:id', deleteAssetController)

// Vulnerabilities related to assets endpoints
router.get('/assets/:id/vulnerabilities', assetVulnerabilitiesController)
router.patch('/assets/:id/vulnerabilities', createAssetVulnerabilityController)
router.post(
  '/assets/:aid/vulnerabilities/:vid',
  vulnerabilityStatusUpdatePayloadValidation,
  updateStatusController,
)
router.get(
  '/assets/:aid/vulnerabilities/:vid/post',
  searchPostAssetVulnerabilityController,
)
router.post(
  '/assets/:aid/vulnerabilities/:vid/post',
  addPostAssetVulnerabilityController,
)
router.post(
  '/assets/vulnerabilities_asset',
  updateVulnerabilitiesAssetController,
)
router.post('/assets/vuln', deleteVulnerabilitiesAssetController)

// Risk data relative to assets
router.get('/assets/:id/risk', assetIdValidation, getAssetRiskController)

// Revisions related to asset document
router.get('/assets/:id/revisions', searchAssetRevisionsController)

router.get('/assets/:id/ports', fetchAssetPortsController)

router.use(errors())

export default router
