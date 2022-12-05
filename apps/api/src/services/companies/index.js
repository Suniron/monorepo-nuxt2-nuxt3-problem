// @ts-check
import { companiesAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'

/**
 *
 * @param {*} params
 * @param {string} accessToken
 */
export const searchCompaniesService = async (params, accessToken = '') => {
  const {
    error,
    company,
    companies,
    total,
  } = await companiesAPIs.searchCompanies(params, accessToken)

  if (error) return createServiceError(error)

  const formatCompany = (cp) => ({
    id: cp.id,
    name: cp.name,
  })

  return company
    ? {
        company: formatCompany(company),
      }
    : {
        companies: companies.map(formatCompany),
        total,
      }
}

/**
 *
 * @param {*} params
 * @param {string} accessToken
 */
export const createCompanyService = async (params, accessToken = '') => {
  const { error, id } = await companiesAPIs.createCompany(params, accessToken)
  if (error) return createServiceError(error)
  return { id }
}

/**
 *
 * @param {*} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string, logo?: string}>}
 */
export const searchCompanyLogoService = async (params, accessToken = '') => {
  const { error, logo } = await companiesAPIs.searchCompanyLogo(
    params,
    accessToken
  )
  if (error) return createServiceError(error)
  return { logo }
}

/**
 *
 * @param {{logo: string}} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string , status?: string}>}
 */
export const updateCompanyLogoService = async (params, accessToken = '') => {
  const { error, status } = await companiesAPIs.updateCompanyLogo(
    params,
    accessToken
  )
  if (error) return createServiceError(error)
  return { status }
}

/**
 *
 * @param {*} params
 * @param {string} accessToken
 * @returns {Promise<{error?: string , status?: string}>}
 */
export const deleteCompanyLogoService = async (params, accessToken = '') => {
  const { error, status } = await companiesAPIs.deleteCompanyLogo(
    params,
    accessToken
  )
  if (error) return createServiceError(error)
  return { status }
}
export const updateCompanyService = async (params, accessToken = '') => {
  const { error, status } = await companiesAPIs.updateCompany(
    params,
    accessToken
  )
  if (error) return createServiceError(error)
  return { status }
}

export const getCompanyRiskService = async (accessToken = '') => {
  const risk = await companiesAPIs.getCompanyRisk(accessToken)
  return risk
}
