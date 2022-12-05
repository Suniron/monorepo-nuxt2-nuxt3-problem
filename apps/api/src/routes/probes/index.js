import express from 'express'
import {
  searchProbesController,
  updateProbesController,
} from '@/controllers/probes'
const router = express.Router()

router.get('/probes', searchProbesController)
router.patch('/probes/:id', updateProbesController)

export default router
