// @ts-check
/**
 * @typedef {import('knex').Knex} Knex
 */

import {
  MODEL_ERROR,
  VALIDATION_ERROR,
  SUCCESS,
  UNAUTHORIZED,
} from '@/common/constants'
import { knex } from '@/common/db'
import {
  isOwnerOfRemediationProject,
  isOwnerOrAssigneeOfRemediationProject,
  isScopeOfRemediationProject,
  checkRemediationProjectExistsOrIsAuthorised,
} from '@/utils/remediationProject.utils'

/**
 * @typedef {import('@/types/remediationProject').RemediationProjectSummary} RemediationProjectSummary
 * @typedef {import('@/types/remediationProject').RemediationProjectHistory} RemediationProjectHistory
 * @typedef {import('@/types/remediationProject').RemediationProjectDetails} RemediationProjectDetails
 * @typedef {import('@/types/remediationProject').RemediationProjectScopeItem} RemediationProjectScopeItem
 * @typedef {import('@/types/remediationProject').RemediationProjectComment} RemediationProjectComment
 */

/**
 * @param {number} remediationProjectId Search param with ID of a remediation project
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string} | RemediationProjectDetails>}
 */
export const getRemediationProjectsModel = async (
  remediationProjectId,
  loggedUserInfo
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    /**
     * @type {RemediationProjectDetails}
     */
    const remediationProjectDetails = await knex
      .select()
      .from('v_remediation_project_details')
      .where({ project_id: remediationProjectId })
      .first()

    return remediationProjectDetails
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}

/**
 * @param {object} _params
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string} | {remediationProjects: RemediationProjectSummary[], total: number }>}
 */
export const getRemediationProjectsSummaryModel = async (
  _params,
  loggedUserInfo
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    /**
     * @type {RemediationProjectSummary[]}
     */
    const remediationProjects = await knex
      .select()
      .from('v_remediation_project_summary_list')
      .where('company_id', userCompanyId)

    return {
      remediationProjects: remediationProjects,
      total: remediationProjects.length,
    }
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}

/**
 * @param {number} remediationProjectId Search param with required ID of a remediation project
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string} | RemediationProjectScopeItem[] >}
 */
export const getRemediationProjectsScopeModel = async (
  remediationProjectId,
  loggedUserInfo
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    /**
     * @type {RemediationProjectScopeItem[]}
     */
    const remediationProjectScope = await knex
      .select()
      .from('v_remediation_project_scope')
      .where({ project_id: remediationProjectId })

    return remediationProjectScope
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}

/**
 * @param {number} remediationProjectId
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string} | RemediationProjectHistory[]>}
 */
export const getRemediationProjectStatusHistoryModel = async (
  remediationProjectId,
  loggedUserInfo
) => {
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
    const remediationProjectStatusChanges = await knex
      .select()
      .from('v_remediation_project_status_history')
      .where({ project_id: remediationProjectId })
      .orderBy('from_date', 'desc')

    return remediationProjectStatusChanges
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}

/**
 * @param {number} remediationProjectId
 * @param {import('@/types/remediationProject').RemediationProjectEdit} params
 * @param {*} loggedUserInfo
 * @returns {Promise<{status: string, data?: {status_history_id: number | null}} | {error: string}>}
 */
export const updateRemediationProjectsModel = async (
  remediationProjectId,
  params,
  loggedUserInfo = {}
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    const returnValue = {
      status_history_id: null,
    }
    let result = SUCCESS
    const [projectOwnerId] = await knex
      .select('fk_owner')
      .from('remediation_project')
      .where('id', remediationProjectId)
      .pluck('fk_owner')

    const projectAssignees = await knex
      .select('fk_user_id')
      .from('remediation_project_assignee')
      .where('fk_project_id', remediationProjectId)
      .pluck('fk_user_id')

    const isUserProjectOwner = projectOwnerId === loggedUserInfo.id
    const isUserProjectAssignee = projectAssignees.includes(loggedUserInfo.id)

    if (isUserProjectOwner || isUserProjectAssignee) {
      // Create a knex transaction and update each fields if they exist in the params
      await knex.transaction(async (trx) => {
        // If the user is the project owner, edit all fields from the params:
        if (isUserProjectOwner) {
          await Promise.all(
            [
              {
                paramName: 'project_name',
                fieldName: 'name',
              },
              {
                paramName: 'project_description',
                fieldName: 'description',
              },
              {
                paramName: 'due_date',
                fieldName: 'due_date',
              },
              {
                paramName: 'priority_id',
                fieldName: 'fk_priority_id',
              },
              {
                paramName: 'owner_id',
                fieldName: 'fk_owner',
              },
            ].map((field) => {
              if (
                params[field.paramName] !== undefined &&
                params[field.paramName] !== null
              ) {
                return trx
                  .update(field.fieldName, params[field.paramName])
                  .from('remediation_project')
                  .where({ id: remediationProjectId })
              }
            })
          )

          // Update project assignees, if necessary
          if (params.assignees) {
            await trx('remediation_project_assignee')
              .where('fk_project_id', remediationProjectId)
              .delete()

            await trx('remediation_project_assignee').insert(
              params.assignees.map((userId) => ({
                fk_user_id: userId,
                fk_project_id: remediationProjectId,
              }))
            )
          }
        }

        /**
         * Whether or not the user is a project owner or assignee, check if the params contain the status_id field
         */
        if (params.status_id !== undefined && params.status_id !== null) {
          /**
           * @type {{
           *  transitionName: import('@/types/projectStatusWorkflow').TransitionNames
           * }}
           */
          const transitionResult = await knex
            .select({
              transitionName: 'psw.transition',
            })
            .from('remediation_project_status_history')
            .innerJoin(
              { psw: 'project_status_workflow' },
              'psw.fk_from_status_id',
              'remediation_project_status_history.fk_status_id'
            )
            .where('fk_project_id', remediationProjectId)
            .andWhere('end_date', null)
            .andWhere('psw.fk_to_status_id', params.status_id)
            .first()

          if (!transitionResult) {
            result = MODEL_ERROR
            return
          }

          const { transitionName } = transitionResult

          let isUserAllowedToChangeStatus = isUserProjectOwner

          // Using a switch is case (haha) we get more complex permission rules
          switch (transitionName) {
            case 'start':
            case 'send_for_review':
              isUserAllowedToChangeStatus ||= isUserProjectAssignee
              break

            default:
              break
          }

          const now = new Date()

          if (isUserAllowedToChangeStatus) {
            await trx('remediation_project_status_history')
              .where('fk_project_id', remediationProjectId)
              .andWhere('end_date', null)
              .update({
                end_date: now,
              })

            const [{ id: statusHistoryId }] = await trx(
              'remediation_project_status_history'
            )
              .insert({
                fk_project_id: remediationProjectId,
                fk_status_id: params.status_id,
                fk_user_id: loggedUserInfo.id,
                start_date: now,
              })
              .returning('id')

            returnValue.status_history_id = statusHistoryId
          } else {
            result = UNAUTHORIZED
          }
        } else if (
          !isUserProjectOwner &&
          /**
           * If the params do not contain the status_id field but contains any other field, send the unauthorized error
           */
          (params.assignees ||
            params.due_date ||
            params.owner_id ||
            params.priority_id ||
            params.project_description ||
            params.project_name)
        ) {
          result = UNAUTHORIZED
        }
      })
    } else {
      result = UNAUTHORIZED
    }

    if (result === SUCCESS) {
      return { status: result, data: returnValue }
    }
    return { status: result }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {number} remediationProjectId
 * @param {import('@/types/remediationProject').RemediationProjectScopeEdit} params
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{status?: string, data?: {deleted: number, inserted: number}} | {error: string}>}
 */
export const updateRemediationProjectScopeModel = async (
  remediationProjectId,
  params,
  loggedUserInfo
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    // Check if connected user is the owner of the remediation project:
    if (
      !(await isOwnerOfRemediationProject(
        remediationProjectId,
        loggedUserInfo.id
      ))
    ) {
      return { error: UNAUTHORIZED }
    }

    const { project_scope } = params
    // Update project scope
    // Step 1: Remove deleted scope items from existing:
    const deletedRows = await knex('remediation_project_scope')
      .where('fk_project_id', remediationProjectId)
      .whereNotIn('fk_vulnerability_asset_id', project_scope)
      .del()
      .returning('id')

    // Step 2: Insert new scope items:
    const existedRows = await knex('remediation_project_scope')
      .select('fk_vulnerability_asset_id')
      .where('fk_project_id', remediationProjectId)
      .pluck('fk_vulnerability_asset_id')
    const rowsToInsert = project_scope
      .filter(
        (asset_vulnerability_id) =>
          !existedRows.includes(asset_vulnerability_id)
      )
      .map((asset_vulnerability_id) => ({
        fk_project_id: remediationProjectId,
        fk_vulnerability_asset_id: asset_vulnerability_id,
      }))
    if (rowsToInsert.length) {
      const insertedRows = await knex('remediation_project_scope')
        .insert(rowsToInsert)
        .returning('id')
      return {
        status: SUCCESS,
        data: {
          deleted: deletedRows.length,
          inserted: insertedRows.length,
        },
      }
    }
    return {
      status: SUCCESS,
      data: { deleted: deletedRows.length, inserted: 0 },
    }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {number} remediationProjectId
 * @param {string} scopeItemId
 * @param {import('@/types/remediationProject').RemediationProjectScopeItemEdit} params
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{status: string} | {error: string}>}
 */
export const updateRemediationProjectScopeItemModel = async (
  remediationProjectId,
  scopeItemId,
  params,
  loggedUserInfo
) => {
  try {
    const { companyId: userCompanyId } = loggedUserInfo
    // Check if the remediation project exists or belongs to the same company than the user
    const checkError = await checkRemediationProjectExistsOrIsAuthorised(
      remediationProjectId,
      userCompanyId
    )
    if ('error' in checkError) {
      return checkError
    }
    // Check if connected user is collaborator of the remediation project (owner or assignee):
    if (
      !(await isOwnerOrAssigneeOfRemediationProject(
        remediationProjectId,
        loggedUserInfo.id
      ))
    ) {
      return { error: UNAUTHORIZED }
    }

    if (
      !(await isScopeOfRemediationProject(remediationProjectId, scopeItemId))
    ) {
      return { error: VALIDATION_ERROR }
    }

    // Update "is_done" field in database:
    await knex('remediation_project_scope')
      .where({
        id: scopeItemId,
        fk_project_id: remediationProjectId,
      })
      .update({ is_done: params.is_done })

    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {{
 *  name: any,
 *  description: any,
 *  owner: any,
 *  priority: any,
 *  due_date: any,
 *  start_date: any,
 *  assignees: any,
 *  project_scope: any,
 * }} body
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{id: number} | {error: string}>}
 */
export const createRemediationProjectsModel = async (body, loggedUserInfo) => {
  const {
    name,
    description,
    owner,
    priority,
    due_date,
    start_date,
    assignees,
    project_scope,
  } = body
  const { companyId } = loggedUserInfo
  try {
    const [{ id }] = await knex
      .insert({
        fk_company_id: companyId,
        name,
        description,
        fk_owner: owner,
        fk_priority_id: priority,
        due_date,
        creation_date: new Date().toISOString(),
        start_date,
      })
      .into('remediation_project')
      .returning('id')

    await Promise.all([
      knex
        .insert(
          assignees.map((assigneeUUID) => ({
            fk_project_id: id,
            fk_user_id: assigneeUUID,
          }))
        )
        .into('remediation_project_assignee'),

      knex
        .insert(
          project_scope.map((assetVulnId) => ({
            fk_project_id: id,
            fk_vulnerability_asset_id: assetVulnId,
          }))
        )
        .into('remediation_project_scope'),

      knex
        .insert({
          fk_project_id: id,
          fk_user_id: loggedUserInfo.id,
        })
        .into('remediation_project_status_history'),
    ])

    return { id }
  } catch (error) {
    console.error(error)
    return {
      error: MODEL_ERROR,
    }
  }
}

/**
 * Return all comments from a remediation project
 *
 * @param {number} remediationProjectId
 * @param {Express.LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string } | RemediationProjectComment[]>}
 */
export const getRemediationProjectCommentsModel = async (
  remediationProjectId,
  loggedUserInfo
) => {
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
    /**
     * @type {RemediationProjectComment[]}
     */
    const comment = await knex
      .select()
      .from('v_remediation_project_comment')
      .where('project_id', remediationProjectId)

    return comment
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
