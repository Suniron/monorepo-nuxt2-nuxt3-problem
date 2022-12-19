export type ProjectStatusHistory = {
  id: number
  transition: transitionNames
  fk_from_status_id: number
  fk_to_status_id: number
}

export enum Transitions {
  start = 'start',
  send_for_review = 'send_for_review',
  accept = 'accept',
  refuse = 'refuse',
  cancel = 'cancel',
  re_open = 're_open',
}

export type TransitionNames = keyof typeof Transitions
