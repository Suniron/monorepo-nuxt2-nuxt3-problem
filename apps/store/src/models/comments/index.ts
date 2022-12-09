
import { knex } from '../../../src/common/db'

import { MODEL_ERROR } from '../../../src/common/constants'

import { log } from '../../../src/lib/logger'

export const searchCommentsModel = async (loggedUserInfo = {}) => {
  try {

    const { roles, groups } = loggedUserInfo

    const query = knex.select('ast.id').from('asset as ast')

    if (!roles.includes('admin')) {
      query
        .innerJoin('group_asset as gast', 'gast.asset_id', 'ast.id')
        .whereIn('gast.group_id', groups)
    }
    const assetIds = await query

    if (assetIds.length === 0) return []
    // else {
    //   queryComments = knex.select().from('comment')
    // }
  } catch (error) {
    log.withError(error).error('searchCommentsModel')
    return { error: MODEL_ERROR }
  }
}
