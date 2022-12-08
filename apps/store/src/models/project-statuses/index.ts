// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, NOT_FOUND, VALIDATION_ERROR } from '@/common/constants'

/**
 * @typedef {import('@/types/projectStatus').AvailableTransition} AvailableTransition
 */

/**
 * Returns all available transitions from all project statuses.
 * If a specific status ID is given in params, returns only transition availables from this one.
 *
 * @param {{statusId?: number}} params Search params with optionnal ID of a status
 * @returns {Promise<AvailableTransition[] | {error?: string}>}
 */
export const getAvailableTransitionsModel = async (params: any) => {
  try {
    // == There is no status id ==
    if (!params.statusId) {
      /**
       * @type {AvailableTransition[]}
       */
      const allAvailableTransitions = await knex
        .select()
        .table('v_project_status_workflow')
      return allAvailableTransitions
    }
    // == There is a status id for which get available transitions ==
    // Check params:
    if (isNaN(params.statusId)) {
      return {
        error: VALIDATION_ERROR,
      }
    }
    /**
     * @type {AvailableTransition[]}
     */
    const availableTransitions = await knex
      .select()
      .table('v_project_status_workflow')
      .where({ from_status_id: params.statusId })

    if (!availableTransitions) {
      return {
        error: NOT_FOUND,
      }
    }

    return availableTransitions
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
