import {
  RemediationProjectSummary,
  SpecificRemediationProject,
  RemediationProjectScopeItem,
  RemediationProjectPost,
  RemediationProjectStatusHistory
} from '~/types/remediationProject'

export type RemediationProjectDetails = {
  info?: SpecificRemediationProject
  scope?: RemediationProjectScopeItem[]
  posts?: RemediationProjectPost[]
  statusHistory?: RemediationProjectStatusHistory[]
}

export interface RemediationProjectState {
  remediationProjectIdPrefix: string
  remediationProjects: RemediationProjectSummary[]
  projectDetails: RemediationProjectDetails
}
