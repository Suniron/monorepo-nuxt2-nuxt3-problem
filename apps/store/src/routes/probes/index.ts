import express from 'express'
import {
  searchProbesController,
  updateProbeController,
} from '@/controllers/probes'
import { celebrate, Segments, Joi } from 'celebrate'
const router = express.Router()

const updateValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
  }),
})

router.get('/probes', searchProbesController)
router.patch('/probes/:id', updateValidation, updateProbeController)

export default router
