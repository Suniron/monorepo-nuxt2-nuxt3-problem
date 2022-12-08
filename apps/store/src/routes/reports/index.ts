import express from 'express'
import { generateController } from '@/controllers/reports'

const router = express.Router()

router.get('/reports', generateController)

export default router
