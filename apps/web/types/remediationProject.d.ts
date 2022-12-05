import { AssetType } from './asset'
import { ProjectPriorityName, ProjectPriorityWeight } from './project'
import { BaseUser } from './user'
import { VulnerabilitySeverityName } from './vulnerability'

export type RemediationProjectStatus = 
  'open'
  | 'in_progress'
  | 'to_review'
  | 'completed'
  | 'canceled'
  | 'overdue'

export type RemediationProjectStatusWeight = 1 | 2 | 3 | 4 | 5
export interface RemediationProject {
  project_id: number
  project_name: string
  owner_id: string
  owner_name: string
  priority: ProjectPriorityName
  status: RemediationProjectStatus
  status_id: number
  status_weight: RemediationProjectStatusWeight
  /**
   * like "2022-06-06T18:30:00.000Z"
   */
  due_date: string
  is_overdue: boolean
}

export interface RemediationProjectSummary extends RemediationProject {
  priority_weight: number
  company_id: number
}

export interface SpecificRemediationProject extends RemediationProject {
  /**
   * like "2022-06-06T18:30:00.000Z"
   */
  creation_date: string
  /**
   * like "2022-06-06T18:30:00.000Z"
   */
  start_date: string
  assignees: BaseUser[]
  project_description: string
}

export interface RemediationProjectScopeItem {
  project_scope_id: number
  /**
   * Remediation project id
   */
  project_id: number
  asset_id: number
  asset_name: string
  asset_type: AssetType
  vulnerability_id: number
  vulnerability_name: string
  vulnerability_asset_id: number
  severity?: VulnerabilitySeverityName
  remediation: string
  is_done: boolean
}

export interface StatusTransition {
  project_status_workflow_id: number
  transition: 
    'start'
    | 'accept'
    | 'refuse'
    | 'send_for_review'
    | 'cancel'
    | 're_open'
  from_status_id: number
  from_status_name: RemediationProjectStatus
  to_status_id: number
  to_status_name: RemediationProjectStatus
}

export interface RemediationProjectPost {
  project_id: number
  comment_id: number
  /**
   * like "2022-06-02T16:00:00.000Z"
   */
  from_date: string
  user_id: string
  user_name: string
  comment: string
  from_status_name?: RemediationProjectStatus
  to_status_name?: RemediationProjectStatus
}

export interface RemediationProjectStatusHistory {
  project_id: number
  user_id: string
  user_name: string
  /**
   * like "2022-06-02T16:00:00.000Z"
   */
  from_date: string
  comment?: string
  from_status_name?: RemediationProjectStatus
  to_status_name: RemediationProjectStatus
}

export interface ScopeType {
  source: {
    type: 'CLUSTER' | 'SUPERASSET' | 'INITIAL'
    id: number
    name: string
  }
  asset: {
    id: number
    name: string
  }
  vulnerability: {
    id: number
    name: string
    vastId: number
  }
}
