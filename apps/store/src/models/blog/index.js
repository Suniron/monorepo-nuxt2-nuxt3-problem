// @ts-check
import { knex } from '@/common/db'
import {
  MODEL_ERROR,
  VALIDATION_ERROR,
  SUCCESS,
  UNAUTHORIZED,
} from '@/common/constants'
import {
  isOwnerOrAssigneeOfRemediationProject,
  checkRemediationProjectExistsOrIsAuthorised,
} from '@/utils/remediationProject.utils'
import { log } from '@/lib/logger'

export const fetchPostsModel = async (loggedUserInfo = {}) => {
  try {
    const { companyId, groups, roles } = loggedUserInfo
    const query = knex('vulnerability_asset')
      .distinctOn('vast.id')
      .select({
        vast_id: 'vast.id',
        type: 'ast.type',
        ast_id: 'ast.id',
        name: 'ast.name',
        vuln_name: 'vuln.name',
        comment: 'cmt.comment',
        created_at: 'cmt.created_at',
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
    return { posts: posts, total: posts.length }
  } catch (error) {
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
  remediationProjectId,
  body,
  loggedUserInfo
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
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    // If user is not owner or assignee, it's forbidden to post a comment:
    if (
      !(await isOwnerOrAssigneeOfRemediationProject(
        remediationProjectId,
        loggedUserInfo.id
      ))
    ) {
      return { error: UNAUTHORIZED }
    }

    // If comment comes with new status:
    if (remediationProjectStatusHistoryId) {
      // Check if this status history from this remediation project:
      if (
        !(
          await knex.select().from('remediation_project_status_history').where({
            id: remediationProjectStatusHistoryId,
            fk_project_id: remediationProjectId,
          })
        ).length
      ) {
        return { error: VALIDATION_ERROR }
      }
    }

    // Add new comment:
    const [{ id }] = await knex
      .insert({
        fk_remediation_project_id: remediationProjectId,
        fk_user_id: loggedUserInfo.id,
        fk_remediation_project_status_history_id: remediationProjectStatusHistoryId,
        comment,
      })
      .into('comment_remediation_project')
      .returning('id')

    return { id, status: SUCCESS }
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}
