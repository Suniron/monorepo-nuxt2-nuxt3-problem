import { complianceAPIs } from '@/api/store'

const groupBy = function (xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const fetchComplianceService = async (params, accessToken = '') => {
  const result = await complianceAPIs.fetchCompliance(params, accessToken)
  const { compliance = null } = params
  if (compliance)
    result.compliances = groupBy(result.compliances, 'chapter')

  return result
}
