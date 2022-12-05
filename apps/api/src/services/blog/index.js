import { postsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const fetchPostsService = async (accessToken = '') => {
  try {
    const data = postsAPIs.fetchPosts(accessToken)
    return data
  } catch (error) {
    log.withError(error).error('fetchPostsService')
    return createServiceError(error)
  }
}

export const CreateRemediationProjectPostsService = async (
  params,
  body,
  accessToken = ''
) => {
  const data = await postsAPIs.CreateRemediationProjectPostsService(
    params.id,
    body,
    accessToken
  )
  return data
}
