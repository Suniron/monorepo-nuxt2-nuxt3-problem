import { knex } from '../../../src/common/db'
import {
  MODEL_ERROR,
  SUCCESS,
  UNAUTHORIZED,
  VALIDATION_ERROR,

} from '../../../src/common/constants'
import {
  checkRemediationProjectExistsOrIsAuthorised,
  isOwnerOrAssigneeOfRemediationProject,

} from '../../../src/utils/remediationProject.utils'

import { log } from '../../../src/lib/logger'

export const fetchPostsModel = async (loggedUserInfo = {}) => {
  try {
    const { companyId, groups, roles } = loggedUserInfo
    const query = knex('vulnerability_asset')
      .distinctOn('vast.id')
      .select({
        ast_id: 'ast.id',
        comment: 'cmt.comment',
        created_at: 'cmt.created_at',
        name: 'ast.name',
        type: 'ast.type',
        vast_id: 'vast.id',
        vuln_name: 'vuln.name',
      })
      .from('vulnerability_asset as vast')
      .innerJoin('vulnerability as vuln', 'vuln.id', 'vast.vulnerability_id')
      .innerJoin('comment as cmt', 'cmt.vulnerability_asset_id', 'vast.id')
      .innerJoin('asset as ast', 'ast.id', 'vast.asset_id')
      .innerJoin('company as cp', 'cp.id', 'ast.company_id')
      .orderBy([
        { column: 'vast.id' },
        { column: 'cmt.created_at', order: 'DESC' },
      ])
      .where('cp.id', companyId)

    if (!roles.includes('admin')) {
      if (groups) {
        const groupsSubquery = knex
          .select('asset_id')
          .from('group_asset as gast')
          .whereIn('gast.group_id', groups)
          .groupBy('asset_id')
          .as('agg_group')
        query.innerJoin(groupsSubquery, 'agg_group.asset_id', 'ast.id')
      }
    }
    const posts = await query
    return { posts, total: posts.length }
  }
  catch (error) {
    log.withError(error).error('fetchPostsModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {number} remediationProjectId
 * @param {{comment: string, remediation_project_status_history_id: number}} body
 * @param {Express.LoggedUser} loggedUserInfo
 */
export const createRemediationProjectPostsModel = async (
  remediationProjectId: any,
  body: any,
  loggedUserInfo: any,
) => {
  const {
    comment,
    remediation_project_status_history_id: remediationProjectStatusHistoryId,
  } = body
  const { companyId: userCompanyId } = loggedUserInfo
  try {
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId,
    )
    if ('error' in checkError)
      return checkError

    // If user is not owner or assignee, it's forbidden to post a comment:
    if (
      !(await isOwnerOrAssigneeOfRemediationProject(
        remediationProjectId,
        loggedUserInfo.id,
      ))
    )
      return { error: UNAUTHORIZED }

    // If comment comes with new status:
    if (remediationProjectStatusHistoryId) {
      // Check if this status history from this remediation project:
      if (
        !(
          await knex.select().from('remediation_project_status_history').where({
            fk_project_id: remediationProjectId,
            id: remediationProjectStatusHistoryId,
          })
        ).length
      )
        return { error: VALIDATION_ERROR }
    }

    // Add new comment:
    const [{ id }] = await knex
      .insert({
        comment,
        fk_remediation_project_id: remediationProjectId,
        fk_remediation_project_status_history_id: remediationProjectStatusHistoryId,
        fk_user_id: loggedUserInfo.id,
      })
      .into('comment_remediation_project')
      .returning('id')

    return { id, status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}
