import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createAssetController,
  createAssetVulnerabilityController,
  deleteAssetController,
  deleteAssetsBulkController,
  fetchAssetPortsController,
  getAssetRiskController,
  importCsvController,
  searchAssetRevisionsController,
  searchAssets,
  searchAssetsBelongingController,
  updateAssetController,
  updateAssetsBulkController,
} from '@/controllers/assets'
import {
  addPostVulnerabilityAssetController,
  assetVulnerabilitiesController,
  deleteVulnerabilities,
  searchPostVulnerabilityAssetController,
  updatePortInVulnerabilities,
  updateStatusController,
} from '@/controllers/vulnerabilities'
import { passThroughController } from '@/controllers'

const assetIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().required(),
  }),
})

const router = express.Router()

// Asset endpoints
router.get('/', searchAssets)
router.patch('/', updateAssetsBulkController)
router.delete('/', deleteAssetsBulkController)
router.get('/summary', passThroughController)
router.get('/belonging', searchAssetsBelongingController)
router.get('/:id', searchAssets)
router.post('/', createAssetController)
router.patch('/:id', updateAssetController)
router.delete('/:id', deleteAssetController)
router.post('/importCSV', importCsvController)

// Vulnerabilities related to an asset
router.get('/:id/vulnerabilities', assetVulnerabilitiesController)
router.patch('/:id/vulnerabilities', createAssetVulnerabilityController)
router.post('/:aid/vulnerabilities/:vid', updateStatusController)
router.get(
  '/:aid/vulnerabilities/:vid/post',
  searchPostVulnerabilityAssetController,
)
router.post(
  '/:aid/vulnerabilities/:vid/post',
  addPostVulnerabilityAssetController,
)
router.patch('/vulnerabilities_asset/:vastId', updatePortInVulnerabilities)

router.delete('/vulnerabilities_asset/:vastId', deleteVulnerabilities)

// Risk data relative to assets
router.get('/:id/risk', assetIdValidation, getAssetRiskController)

// Revisions related to an asset document
router.get('/:id/revisions', searchAssetRevisionsController)

router.get('/:id/ports', fetchAssetPortsController)

export default router
