import { groupedRemediationsAPIs } from '@/api/store'

export const searchGroupedRemediationsService = async (
  params,
  accessToken = '',
) => {
  const data = await groupedRemediationsAPIs.searchGroupedRemediationsService(
    accessToken,
  )
  return data
}
