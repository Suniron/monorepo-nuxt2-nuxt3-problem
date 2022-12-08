import express from 'express'
import {
  chartsDataController,
  fetchDashboardController,
  updateDashboardUserController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/dashboard' or it... Remove this comment to see the full error message
} from '@/controllers/dashboard'

const router = express.Router()

router.get('/dashboard', chartsDataController)
router.get('/dashboard/:cid', chartsDataController)
router.get('/dashview', fetchDashboardController)
router.post('/dashview/:dashId', updateDashboardUserController)

export default router
