import { RemediationProjectState } from './remediationProject/remediationProjectState'

export interface State {
  assets: any
  company: any
  groups: any
  remediation: RemediationProjectState
  tags: any
  user: any
}
