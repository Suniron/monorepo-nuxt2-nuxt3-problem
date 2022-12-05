import express from 'express'
import {
  fetchComplianceController,
  createComplianceController,
} from '@/controllers/self-assessment'

const router = express.Router()

router.get('/compliance', fetchComplianceController)

export default router
