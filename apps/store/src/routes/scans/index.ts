import express from 'express'
import {
  createScan,
  getScanController,
  getScanReportController,
  parseScanResultController,
  searchAssetScanController,
  searchPhishingScenariosController,
  searchScans,
  updateScanController,
} from '../../controllers/scans/crud-controller'

const router = express.Router()

router.get('/scans', searchScans)
router.post('/scans', createScan)
router.post('/scans/result', parseScanResultController)
router.get('/scans/assets', searchAssetScanController)
router.get('/scans/phishing-scenarios', searchPhishingScenariosController)
router.get('/scans/:scanId', getScanController)
router.patch('/scans/:scanId', updateScanController)
router.get('/scans/:scanId/report', getScanReportController)

export default router
