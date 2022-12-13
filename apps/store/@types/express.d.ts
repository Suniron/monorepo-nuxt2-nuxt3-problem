import { Logger } from "@xrator-freemium/logger";
import type { P } from 'pino'
import type { LogLayer } from 'loglayer'

declare namespace Express {
  type UserRole = 'admin' | 'member'

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

  /**
   * TODO: on Typescript migration, use existing type in **user.d.ts**
   */
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

  export interface Request {
    user: LoggedUser
    log: LogLayer<P.Logger>
  }
}
