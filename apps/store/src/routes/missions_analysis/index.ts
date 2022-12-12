import express from 'express'

import {
  searchBusinessImpactController,
  searchMissionAnalysisController,
  updateBusinessImpactIntoUnit,
} from '../../controllers/missions_analysis'

const router = express.Router()
// Assets endpoints
router.get('/missions_analysis/:id', searchMissionAnalysisController)

router.get('/business_impact', searchBusinessImpactController)

router.patch(
  '/missions_analysis/:fearedEventId/business_impact',
  updateBusinessImpactIntoUnit,
)
export default router
