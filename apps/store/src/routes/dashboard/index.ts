import express from 'express'
import {
  chartsDataController,
  fetchDashboardController,
  updateDashboardUserController,
} from '@/controllers/dashboard'

const router = express.Router()

router.get('/dashboard', chartsDataController)
router.get('/dashboard/:cid', chartsDataController)
router.get('/dashview', fetchDashboardController)
router.post('/dashview/:dashId', updateDashboardUserController)

export default router
