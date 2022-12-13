import { missionsAPIs } from '@/api/store'

export const updateFearedEventsService = async (id, body, accessToken = '') => {
  const data = await missionsAPIs.updateFearedEventSeverityService(
    id,
    body,
    accessToken,
  )
  return data
}
