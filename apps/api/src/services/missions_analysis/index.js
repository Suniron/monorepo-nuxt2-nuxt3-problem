import { missionsAPIs } from '@/api/store'

export const searchMissionAnalysisService = async (
  params,
  accessToken = '',
) => {
  const { id } = params
  const data = await missionsAPIs.searchMissionAnalysisService(
    {
      id,
    },
    accessToken,
  )
  return data
}
export const searchBusinessImpactService = async (params, accessToken = '') => {
  const { id } = params
  const data = await missionsAPIs.searchBusinessImpactService(
    {
      id,
    },
    accessToken,
  )
  return data
}

export const updateBusinessImpactService = async (
  id,
  body,
  accessToken = '',
) => {
  const data = await missionsAPIs.updateBusinessImpactServiceIntoUnit(
    id,
    body,
    accessToken,
  )
  return data
}
