import { createAPIError } from '@/common/errors/api'

export const requestGetRemediationProjectsSummary = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/remediation-projects/summary', {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetRemediationProjects = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/remediation-projects/${id}`, {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetRemediationProjectStatusHistory = async (
  provider,
  id,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(
      `/remediation-projects/${id}/status-history`,
      {
        ...reqConfig,
        params,
      }
    )
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateRemediationProjects = async (
  provider,
  query,
  body,
  accessToken
) => {
  const { axios, logger } = provider
  const { id } = query
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch(
      `/remediation-projects/${Number(id)}`,
      body,
      reqConfig
    )
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetRemediationProjectsScope = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/remediation-projects/${id}/scope`, {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateRemediationProjectScopeService = async (
  provider,
  query,
  body,
  accessToken
) => {
  const { axios, logger } = provider
  const { id } = query
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch(
      `/remediation-projects/${Number(id)}/scope`,
      body,
      reqConfig
    )
    return { data }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateRemediationProjectScopeItemService = async (
  provider,
  query,
  body,
  accessToken
) => {
  const { axios, logger } = provider
  const { id, scopeId } = query
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch(
      `/remediation-projects/${Number(id)}/scope/${Number(scopeId)}`,
      body,
      reqConfig
    )
    return { data }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateRemediationProjects = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post(
      '/remediation-projects',
      params,
      reqConfig
    )
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetRemediationProjectComments = async (
  provider,
  id,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(
      `posts/remediation-project/${Number(id)}`,
      {
        ...reqConfig,
        params,
      }
    )
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestSearchProjectPrioritiesService = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(
      id ? `/projects/priorities/${Number(id)}` : '/projects/priorities',
      {
        ...reqConfig,
        params,
      }
    )
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
