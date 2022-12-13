export type ProjectStatusHistory = {
  id: number
  fk_project_id: number
  fk_user_id: number
  fk_status_id: number
  start_date: string
  end_date: string
}
