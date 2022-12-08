// @ts-check
import { knex } from '@/common/db'
import { MODEL_ERROR, SUCCESS, VALIDATION_ERROR } from '@/common/constants'

/**
 * @typedef {import('@/types/severity').Severity} Severity
 */

/**
 * @param {string} fearedEventId
 * @param {{severityId: number}} params
 * @returns {Promise<{status: string} | {error: string}>}
 */
export const updateFearedEventsModel = async (fearedEventId, params) => {
  try {
    // == Check params ==
    if (
      // bad fearedEventId:
      !fearedEventId ||
      isNaN(Number(fearedEventId)) ||
      // bad severityId:
      !params ||
      !Object.entries(params).length ||
      !params.severityId ||
      isNaN(Number(params.severityId))
    ) {
      return { error: VALIDATION_ERROR }
    }

    const { severityId } = params

    // == Check existence of Severity & Feared Event ==
    // If Severity not found, return error:
    if (!(await knex('severity').select().where({ id: severityId })).length) {
      return { error: MODEL_ERROR }
    }

    // If Feared Event not found, return error:
    if (
      !(
        await knex('business_mission_unit_has_feared_event')
          .select()
          .where({ id: fearedEventId })
      ).length
    ) {
      return { error: MODEL_ERROR }
    }

    // == Update severity ==
    await knex('business_mission_unit_has_feared_event')
      .update('severity_id', severityId)
      .where({ id: fearedEventId })
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
