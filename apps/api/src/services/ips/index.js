import { ipsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'

export const ipValidator = ip =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip,
  )

export const deleteIpControllerService = async (params, accessToken = '') => {
  const { error, SUCCESS } = await ipsAPIs.deleteIp(params, accessToken)
  return error ? createServiceError(error) : { SUCCESS }
}
export const updateIpControllerService = async (body, accessToken = '', id) => {
  const { error, SUCCESS } = await ipsAPIs.updateIp(body, accessToken, id)
  return error ? createServiceError(error) : { SUCCESS }
}
export const createIpControllerService = async (
  body,
  accessToken = '',
  assetId,
) => {
  const { error, ipId } = await ipsAPIs.createIp(body, accessToken, assetId)
  return error ? createServiceError(error) : { ipId }
}
