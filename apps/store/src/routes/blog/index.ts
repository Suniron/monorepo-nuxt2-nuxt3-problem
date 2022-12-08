import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  fetchPostsController,
  createRemediationProjectPostsController,
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
