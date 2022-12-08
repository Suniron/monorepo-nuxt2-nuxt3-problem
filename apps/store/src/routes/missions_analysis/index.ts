import express from 'express'

import {
  searchMissionAnalysisController,
  searchBusinessImpactController,
  updateBusinessImpactIntoUnit,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/missions_analysi... Remove this comment to see the full error message
} from '@/controllers/missions_analysis'

const router = express.Router()
// Assets endpoints
router.get('/missions_analysis/:id', searchMissionAnalysisController)

router.get('/business_impact', searchBusinessImpactController)

router.patch(
  '/missions_analysis/:fearedEventId/business_impact',
  updateBusinessImpactIntoUnit
)
export default router
