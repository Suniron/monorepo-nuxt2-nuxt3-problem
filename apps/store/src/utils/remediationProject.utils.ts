// @ts-check
import { knex } from '@/common/db'
import { NOT_FOUND } from '@/common/constants'

/**
 * Returns **true** if the user is a collaborator of the remediation project (owner or assignee).
 *
 * @param {string|number} remediationProjectId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const isOwnerOfRemediationProject = async (
  remediationProjectId,
  userId
) => {
  // Check if owner:
  if (
    (
      await knex
        .select('*')
        .from('remediation_project')
        .where({ id: remediationProjectId, fk_owner: userId })
    ).length
  ) {
    return true
  }
  return false
}

/**
 * Returns **true** if the user is a collaborator of the remediation project (owner or assignee).
 *
 * @param {string|number} remediationProjectId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const isAssigneeOfRemediationProject = async (
  remediationProjectId,
  userId
) => {
  // Check if in assignees:
  const assigneeIds = (
    await knex
      .select('fk_user_id')
      .from('remediation_project_assignee')
      .where('fk_project_id', remediationProjectId)
  ).map((result) => result.fk_user_id)

  if (assigneeIds.includes(userId)) {
    return true
  }
  return false
}

/**
 * Returns **true** if the user is a collaborator of the remediation project (owner or assignee).
 *
 * @param {string|number} remediationProjectId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const isOwnerOrAssigneeOfRemediationProject = async (
  remediationProjectId,
  userId
) => {
  // Check if owner or assignee:
  if (
    (await isOwnerOfRemediationProject(remediationProjectId, userId)) ||
    (await isAssigneeOfRemediationProject(remediationProjectId, userId))
  ) {
    return true
  }
  return false
}

/**
 * Returns **true** if the scope is belongs to remediation project .
 *
 * @param {string|number} remediationProjectId
 * @param {string|number} projectScopeId
 * @returns {Promise<boolean>}
 */
export const isScopeOfRemediationProject = async (
  remediationProjectId,
  projectScopeId
) => {
  return !!(
    await knex
      .select('*')
      .from('public.remediation_project_scope')
      .where({ id: projectScopeId, fk_project_id: remediationProjectId })
  ).length
}

/**
 * Returns the company id of the remediation project
 *
 * @param {string|number} remediationProjectId
 * @returns {Promise<number>}
 */
export const getRemediationProjectCompanyId = async (remediationProjectId) => {
  const companyId = await knex
    .select('fk_company_id')
    .from('remediation_project')
    .where({ id: remediationProjectId })
    .pluck('id')

  return companyId
}

/**
 * Returns the company id of the remediation project
 *
 * @param {number} remediationProjectId
 * @param {number} companyId
 * @returns {Promise<{ error: string} | {}>}
 */
export const checkRemediationProjectExistsOrIsAuthorised = async (
  remediationProjectId,
  companyId
) => {
  const [projectCompanyId] = await knex
    .select('fk_company_id')
    .from('remediation_project')
    .where({ id: remediationProjectId })
    .andWhere({ fk_company_id: companyId })
    .pluck('fk_company_id')
  if (!projectCompanyId) {
    return {
      error: NOT_FOUND,
    }
  }
  return {}
}
