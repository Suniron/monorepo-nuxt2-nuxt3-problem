import {
  MODEL_ERROR,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../../../src/common/constants'

import prismaClient from '../../../src/prismaClient'

/**
 * @typedef {import('@/types/projectPriority').ProjectPriority} ProjectPriority
 */

/**
 * Returns a list of assets. If an ID is given, returns a single asset object instead.
 *
 * @param {{id?: number}} params Search paramswith optionnal ID of an asset
 * @returns {Promise<{data?: ProjectPriority[] | ProjectPriority, error?: string}>}
 */
export const searchProjectPrioritiesModel = async (params: any) => {
  try {
    // == If user want all severities ==
    if (!params.id) {
      const results = await prismaClient.project_priority.findMany()
      return { data: results }
    }

    // == If user want a specific severity ==
    // Check params:
    if (isNaN(params.id)) {
      return {
        error: VALIDATION_ERROR,
      }
    }

    const result = await prismaClient.project_priority.findUnique({
      where: { id: Number(params.id) },
    })

    if (!result) {
      return {
        error: NOT_FOUND,
      }
    }

    return { data: result }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
