import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createRemediationProjectPostsController,
  fetchPostsController,
} from '../../controllers/blog'

const getRemediationProjectByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
})

const router = Router()
router.get('/posts', fetchPostsController)
router.post(
  '/posts/remediation-project/:id',
  getRemediationProjectByIdValidation,
  createRemediationProjectPostsController,
)

export default router
