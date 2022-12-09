import express from 'express'

import { Joi, Segments, celebrate } from 'celebrate'
import { getAvailableTransitionsController } from '../../controllers/project-statuses'

const router = express.Router()

const getAvailableTransitionByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    statusId: Joi.number().required(),
  }),
})

// Project workflow status endpoints
router.get('/projects/available-transitions', getAvailableTransitionsController)
router.get(
  '/projects/available-transitions/:statusId',
  getAvailableTransitionByIdValidation,
  getAvailableTransitionsController,
)

export default router
