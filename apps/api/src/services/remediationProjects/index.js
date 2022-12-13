import { remediationProjectsAPIs } from '@/api/store'

export const getRemediationProjectsSummaryService = async (
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.getRemediationProjectsSummaryService(
    params,
    accessToken,
  )
  return data
}

export const getRemediationProjectsService = async (
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.getRemediationProjectsService(
    params,
    accessToken,
  )
  return data
}

export const getRemediationProjectStatusHistoryService = async (
  id,
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.getRemediationProjectStatusHistoryService(
    id,
    params,
    accessToken,
  )
  return data
}

export const updateRemediationProjectsService = async (
  id,
  body,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.updateRemediationProjectsService(
    id,
    body,
    accessToken,
  )
  return data
}

export const getRemediationProjectsScopeService = async (
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.getRemediationProjectsScopeService(
    params,
    accessToken,
  )
  return data
}

export const updateRemediationProjectScopeService = async (
  params,
  body,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.updateRemediationProjectScopeService(
    params,
    body,
    accessToken,
  )
  return data
}

export const updateRemediationProjectScopeItemService = async (
  params,
  body,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.updateRemediationProjectScopeItemService(
    params,
    body,
    accessToken,
  )
  return data
}

export const getRemediationProjectCommentsService = async (
  id,
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.getRemediationProjectCommentsService(
    id,
    params,
    accessToken,
  )
  return data
}

export const createRemediationProjectsService = async (
  params,
  accessToken = '',
) => {
  const data = await remediationProjectsAPIs.createRemediationProjectsService(
    params,
    accessToken,
  )
  return data
}
