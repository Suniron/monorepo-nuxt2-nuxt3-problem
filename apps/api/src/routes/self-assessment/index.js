import express from 'express'
import {
  createComplianceController,
  fetchComplianceController,
} from '@/controllers/self-assessment'

const router = express.Router()

router.get('/compliance', fetchComplianceController)

export default router
