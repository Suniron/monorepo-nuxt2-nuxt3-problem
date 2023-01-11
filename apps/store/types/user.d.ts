type UserRole = 'admin' | 'member'

export interface BaseUser {
  user_id: string
  username: string
}

export type User = {
  id: string
  company_id: number
  first_name: string
  last_name: string
  username: string
  password: string
  salt: string
  email: string
  roles: UserRole[]
  reset_token: string
  token_expires_at: number
}

interface DefaultLoggedUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  companyId: number
  companyName: string
  roles: UserRole[]
  typ: string
  iat: number
  exp: number
  aud: string
  iss: string
  is2faInitialized: boolean

}

export interface LoggedUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  companyId: number
  companyName: string
  roles: UserRole[]
  typ: string
  iat: number
  exp: number
  aud: string
  iss: string
  default: DefaultLoggedUser
  is2faInitialized: boolean
}

export interface OptionalUserInfo {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  companyId?: number
  companyName?: string
  roles?: UserRole[]
  typ?: string
  iat?: number
  exp?: number
  aud?: string
  iss?: string
  id?: string
}

export type UserGroup = {
  user_id: string
  group_id: number
}
