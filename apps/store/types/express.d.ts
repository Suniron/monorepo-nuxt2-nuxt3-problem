import type { Logger } from "../src/lib/logger";
import type { LoggedUser } from "../types/user";

declare global {
  namespace Express {
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

    export interface Request {
      user?: LoggedUser
      log: Logger,
      duration?: number
    }
  }
}
