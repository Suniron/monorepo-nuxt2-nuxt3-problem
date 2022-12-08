import express from 'express'
import {
  createScan,
  searchScans,
  getScanController,
  parseScanResultController,
  searchAssetScanController,
  searchPhishingScenariosController,
  updateScanController,
  getScanReportController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/scans/crud-contr... Remove this comment to see the full error message
} from '@/controllers/scans/crud-controller'

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
