import express from 'express'
import {
  CreateRemediationProjectPostsController,
  fetchPostsConroller,
} from '@/controllers/blog'

const router = express.Router()

router.get('/posts', fetchPostsConroller)
router.post(
  '/posts/remediation-project/:id',
  CreateRemediationProjectPostsController,
)

export default router
