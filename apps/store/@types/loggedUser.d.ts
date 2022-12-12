import { UserRole } from './user'

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
}
