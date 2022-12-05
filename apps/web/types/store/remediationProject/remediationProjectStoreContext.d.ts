import { RemediationProjectState } from './remediationProjectState'
import { RemediationProjectMutations } from './remediationProjectMutations'

export interface RemediationProjectStoreContext {
  state: RemediationProjectState
  mutations: RemediationProjectMutations
  commit: (mutation, payload?: any) => void
  dispatch: (action: string, ...arg) => any
}