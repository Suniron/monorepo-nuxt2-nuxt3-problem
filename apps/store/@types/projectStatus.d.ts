export type ProjectStatus = {
  id: number
  name: string
  weight: number
}

export type ProjectStatusWorkflow = {
  id: number
  transition: string
  fk_from_status_id: number
  fk_to_status_id: number
}

export type AvailableTransition = {
  project_status_workflow_id: number
  transition: string
  from_status_id: number
  from_status_name: string
  to_status_id: number
  to_status_name: string
}
