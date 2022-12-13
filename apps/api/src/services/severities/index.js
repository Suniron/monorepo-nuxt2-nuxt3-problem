import { missionsAPIs } from '@/api/store'

export const searchSeveritiesService = async (params, accessToken = '') => {
  const { id } = params
  const data = await missionsAPIs.searchSeveritiesService(
    {
      id,
    },
    accessToken,
  )
  return data
}

export const updateSeveritiesService = async (id, body, accessToken = '') => {
  const data = await missionsAPIs.updateSeveritiesToFearedEventService(
    id,
    body,
    accessToken,
  )
  return data
}
