// @ts-check

import express from 'express'
import {
  searchAssetsController,
  createAssetController,
  deleteAssetController,
  updateAssetController,
  updateAssetsBulkController,
  deleteAssetsBulkController,
  searchAssetRevisionsController,
  importCSVController,
  getAssetsSummaryController,
  fetchAssetPortsController,
  createAssetVulnerabilityController,
  searchAssetsBelongingController,
  getAssetRiskController,
} from '@/controllers/assets'
import {
  assetVulnerabilitiesController,
  updateStatusController,
  addPostAssetVulnerabilityController,
  searchPostAssetVulnerabilityController,
  updateVulnerabilitiesAssetController,
  deleteVulnerabilitiesAssetController,
} from '@/controllers/vulnerabilities'
import { celebrate, Segments, Joi, errors } from 'celebrate'

// Validations
const vulnerabilityStatusUpdatePayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    updated: Joi.string().required().lowercase(),
    comment: Joi.string().allow('').required(),
  }),
})

const assetIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().required(),
  }),
})

const router = express.Router()
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
  updateStatusController
)
router.get(
  '/assets/:aid/vulnerabilities/:vid/post',
  searchPostAssetVulnerabilityController
)
router.post(
  '/assets/:aid/vulnerabilities/:vid/post',
  addPostAssetVulnerabilityController
)
router.post(
  '/assets/vulnerabilities_asset',
  updateVulnerabilitiesAssetController
)
router.post('/assets/vuln', deleteVulnerabilitiesAssetController)

// Risk data relative to assets
router.get('/assets/:id/risk', assetIdValidation, getAssetRiskController)

// Revisions related to asset document
router.get('/assets/:id/revisions', searchAssetRevisionsController)

router.get('/assets/:id/ports', fetchAssetPortsController)

router.use(errors())

export default router
