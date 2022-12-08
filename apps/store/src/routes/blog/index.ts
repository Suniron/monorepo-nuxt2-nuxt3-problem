import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  fetchPostsController,
  createRemediationProjectPostsController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/blog' or its cor... Remove this comment to see the full error message
} from '@/controllers/blog'

const getRemediationProjectByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
})

const router = express.Router()
router.get('/posts', fetchPostsController)
router.post(
  '/posts/remediation-project/:id',
  getRemediationProjectByIdValidation,
  createRemediationProjectPostsController
)

export default router
