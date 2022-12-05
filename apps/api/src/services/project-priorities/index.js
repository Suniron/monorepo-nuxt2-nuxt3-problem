import { remediationProjectsAPIs } from '@/api/store'

export const searchProjectPrioritiesService = async (
  params,
  accessToken = ''
) => {
  const { id } = params
  const data = await remediationProjectsAPIs.searchProjectPrioritiesService(
    {
      id,
    },
    accessToken
  )
  return data
}
