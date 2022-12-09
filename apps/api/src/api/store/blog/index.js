import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestFetchPosts = async (provider, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/posts', reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateRemediationProjectPostsService = async (
  provider,
  id,
  body,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.post(
      `/posts/remediation-project/${Number(id)}`,
      body,
      reqConfig,
    )
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
