import express from 'express'
import {
  fetchPostsConroller,
  CreateRemediationProjectPostsController,
} from '@/controllers/blog'

const router = express.Router()

router.get('/posts', fetchPostsConroller)
router.post(
  '/posts/remediation-project/:id',
  CreateRemediationProjectPostsController
)

export default router
