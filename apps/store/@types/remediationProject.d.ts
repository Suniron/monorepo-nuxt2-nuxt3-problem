import { BaseUser } from './user'

export type RemediationProjectSummary = {
  project_id: number
  project_name: string
  owner_id: string
  owner_name: string
  priority: string
  priority_weight: number
  status: string
  status_weight: number
  due_date: string
  is_overdue: boolean
  company_id: number
}

export type RemediationProjectEdit = {
  project_name: string
  project_description: string
  owner_id: string
  assignees: BaseUser[]
  priority_id: number
  status_id: number
  due_date: string
}

export type RemediationProjectDetails = {
  project_id: number
  project_name: string
  project_description: string
  owner_id: string
  owner_name: string
  assignees: BaseUser[]
  priority: string
  status: string
  status_id: number
  status_weight: number
  creation_date: string
  start_date: string
  due_date: string
  is_overdue: boolean
  company_id: number
}

export type RemediationProjectAssignee = {
  id: number
  fk_project_id: number
  fk_user_id: string
}

export type RemediationProjectScopeItem = {
  project_id: number
  project_scope_id: number
  vulnerability_asset_id: number
  asset_id: number
  asset_type: string
  asset_name: string
  vulnerability_id: number
  vulnerability_name: string
  severity: string
  remediation: string
  is_done: boolean
  company_id: number
}

export type RemediationProjectScope = {
  id: number
  fk_project_id: number
  fk_vulnerability_asset_id: number
  deleted_asset_name: string
  deleted_vulnerability_name: string
  is_done: boolean
}

export interface RemediationProjectScopeEdit {
  project_scope: number[]
}

export interface RemediationProjectScopeItemEdit {
  is_done: boolean
}

export interface RemediationProjectHistory {
  project_id: number
  user_id: string
  user_name: string
  from_date: string
  from_status_name: string
  to_status_name: string
}

export interface RemediationProjectComment {
  project_id: number
  comment_id: number
  from_date: string
  user_id: string
  user_name: string
  comment: string
  from_status_name: string
  to_status_name: string
}
