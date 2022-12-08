// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/project-statuses... Remove this comment to see the full error message
import { getAvailableTransitionsController } from '@/controllers/project-statuses'
import { celebrate, Segments, Joi } from 'celebrate'

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
  getAvailableTransitionsController
)

export default router
