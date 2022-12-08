// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'

export const searchCommentsModel = async (loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'roles' does not exist on type '{}'.
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
