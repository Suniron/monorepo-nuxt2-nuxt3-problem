// @ts-check
import {
  FORBIDDEN,
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  VALIDATION_ERROR,
} from '@/common/constants'
import prismaClient from '@/prismaClient'
import { knex } from '@/common/db'
import {
  convertBase64ImageToBuffer,
  convertBufferToBase64Image,
  isValidBase64Image,
} from '@/utils/image.utils'

export const searchCompanyModel = async (params) => {
  try {
    const query = knex.select('id', 'name').from('company')

    // Where conditions
    const { cid, search } = params
    if (cid) {
      query.where('id', cid)
    } else {
      if (search) {
        query.where(knex.raw('LOWER(name) LIKE ?', `%${search.toLowerCase()}%`))
      }
    }

    const result = await query
    if (Array.isArray(result)) {
      if (cid) {
        const [company] = result
        if (company) return { company }
        else return { error: NOT_FOUND }
      } else {
        return { companies: result, total: result.length }
      }
    }

    return { error: MODEL_ERROR }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createCompanyModel = async (params) => {
  try {
    const { name } = params
    const [{ id }] = await knex('company').insert({ name }).returning('id')

    return id ? { id } : { error: MODEL_ERROR }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} loggedUserInfo
 * @returns {Promise<{logo?: string|null, error?: string}>}
 */
export const searchCompanyLogoModel = async (loggedUserInfo = {}) => {
  if (
    !loggedUserInfo.companyId ||
    typeof loggedUserInfo.companyId !== 'number'
  ) {
    return { error: MODEL_ERROR }
  }

  try {
    const [{ base64_logo }] = await knex
      .select('base64_logo')
      .from('company')
      .where('id', loggedUserInfo.companyId)

    return base64_logo
      ? { logo: convertBufferToBase64Image(base64_logo) }
      : { logo: null }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @param {string} logo encoded base64 image
 * @returns {Promise<{error?: string, status?: string}>}
 */

export const updateCompanyLogoModel = async (loggedUserInfo, logo) => {
  if (
    !loggedUserInfo.companyId ||
    typeof loggedUserInfo.companyId !== 'number'
  ) {
    return { error: MODEL_ERROR }
  }

  if (!loggedUserInfo.roles.includes('admin')) {
    return { error: FORBIDDEN }
  }

  if (
    !logo ||
    typeof logo !== 'string' ||
    !logo.startsWith('data:image/') ||
    !isValidBase64Image(logo)
  ) {
    return { error: VALIDATION_ERROR }
  }

  try {
    await knex('company')
      .update('base64_logo', convertBase64ImageToBuffer(logo))
      .where('id', loggedUserInfo.companyId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} loggedUserInfo
 * @returns {Promise<{error?: string, status?: string}>}
 */
export const deleteCompanyLogoModel = async (loggedUserInfo = {}) => {
  if (
    !loggedUserInfo.companyId ||
    typeof loggedUserInfo.companyId !== 'number'
  ) {
    return { error: MODEL_ERROR }
  }

  try {
    await knex('company')
      .update('base64_logo', null)
      .where('id', loggedUserInfo.companyId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} loggedUserInfo
 * @type {object}
 * @property {string} name
 * @property {number} selectedDomain
   @returns {Promise<{error?: string, status?: string}>}
*/

export const updateCompanyModel = async (loggedUserInfo = {}, content) => {
  try {
    const { selectedDomain } = content
    const { companyId = null } = loggedUserInfo
    // looking if the company ID really exists.
    const isCompanyFound = await prismaClient.company.findFirst({
      select: {
        id: true,
      },
      where: {
        id: companyId,
      },
    })

    // looking if the ID passed really exists.
    const isDomainFound = await prismaClient.phishing_scenario_domain.findFirst(
      {
        where: {
          id: selectedDomain,
        },
      }
    )
    if (!isDomainFound || !isCompanyFound) {
      return { error: MODEL_ERROR }
    }
    await prismaClient.company.update({
      where: {
        id: companyId,
      },
      data: {
        fk_phishing_scenario_domain_id: selectedDomain,
      },
    })
    return { status: SUCCESS }
  } catch (error) {
    return { error: MODEL_ERROR }
  }
}

/**
 * Returns the global company risk score
 *
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{error: string} | {globalScore: number | null}>}
 */
export const getCompanyRiskModel = async (loggedUserInfo) => {
  try {
    const { companyId } = loggedUserInfo

    const businessMissionsScores = await prismaClient.v_asset_risk_scores.findMany(
      {
        select: {
          compound_score: true,
        },
        where: {
          asset_type: 'MISSION',
          company_id: companyId,
          compound_score: {
            not: null,
          },
        },
      }
    )
    /**
     * @type {{
     *  globalScore: number | null
     * }}
     */
    let data = {
      globalScore: null,
    }
    if (businessMissionsScores) {
      data.globalScore =
        businessMissionsScores.reduce(
          (acc, score) => acc + (score.compound_score ?? 0),
          0
        ) / businessMissionsScores.length
    }
    return data
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
