import { projectStatusesAPIs } from '@/api/store'

export const getAvailableTransitionsService = async (
  params,
  accessToken = ''
) => {
  const data = await projectStatusesAPIs.getAvailableTransitionsService(
    params,
    accessToken
  )
  return data
}
