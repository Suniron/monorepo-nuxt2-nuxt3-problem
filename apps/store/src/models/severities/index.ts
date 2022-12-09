

import { knex } from '../../../src/common/db'

import { MODEL_ERROR, NOT_FOUND, VALIDATION_ERROR } from '../../../src/common/constants'

/**
 * @typedef {import('@/types/severity').Severity} Severity
 */

/**
 * Returns a list of assets. If an ID is given, returns a single asset object instead.
 *
 * @param {{id?: number}} params Search paramswith optionnal ID of an asset
 * @returns {Promise<Severity[] | Severity | {error: string}>}
 *
 */
export const searchSeveritiesModel = async (params: any) => {
  try {
    // == If user want all severities ==
    if (!params.id) {
      /**
       * @type {Severity[]}
       */
      const results = await knex.select().table('severity')
      return results
    }

    // == If user want a specific severity ==
    // Check params:
    if (isNaN(params.id)) {
      return {
        error: VALIDATION_ERROR,
      }
    }

    /**
     * @type {Severity[]}
     */
    const [result] = await knex
      .select()
      .table('severity')
      .where({ id: params.id })

    if (!result) {
      return {
        error: NOT_FOUND,
      }
    }

    return result
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
