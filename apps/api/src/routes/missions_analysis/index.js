import express from 'express'
import {
  searchMissionAnalysis,
  searchBusinessImpact,
  updateBusinessImpactIntoUnit,
} from '@/controllers/missions_analysis'

const router = express.Router()

// Asset endpoints
router.get('/missions_analysis/:id', searchMissionAnalysis)
router.get('/business_impact', searchBusinessImpact)
router.patch(
  '/missions_analysis/:fearedEventId/business_impact',
  updateBusinessImpactIntoUnit
)
export default router
