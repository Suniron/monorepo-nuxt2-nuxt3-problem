import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/reports' or its ... Remove this comment to see the full error message
import { generateController } from '@/controllers/reports'

const router = express.Router()

router.get('/reports', generateController)

export default router
