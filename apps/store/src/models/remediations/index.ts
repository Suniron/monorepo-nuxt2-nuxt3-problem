import { knex } from '../../../src/common/db'

import { MODEL_ERROR } from '../../../src/common/constants'

/**
 * @typedef {import('@/types/remediations').Remediation} Remediation
 */

/**
 * Returns a list of assets. If an ID is given, returns a single asset object instead.
 *sxx
 * @param {{id?: number}} params Search paramswith optionnal ID of an asset
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{data?: Remediation[]} | {error: string}>}
 */
export const searchGroupedRemediationsModel = async (
  params: any,
  loggedUserInfo: any,
) => {
  const { companyId: userCompanyId } = loggedUserInfo
  try {
    const results = await knex
      .select()
      .from('v_grouped_remediation')
      .where({ company_id: userCompanyId })
      .orderBy('count_vuln', 'desc')
    results.forEach((element: any) => {
      element.count_vuln = parseInt(element.count_vuln)
      element.count_asset = parseInt(element.count_asset)
      element.count_asset_vuln = parseInt(element.count_asset_vuln)
      element.count_asset_vuln_unmanaged = parseInt(
        element.count_asset_vuln_unmanaged,
      )
    })
    return { data: results }

    // throw new Error('Unexpected result at search serities')
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
