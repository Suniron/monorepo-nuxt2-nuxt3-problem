import type { Logger } from "../src/lib/logger";
import type { LoggedUser } from "../types/user";

declare global {
  namespace Express {
    export interface Request {
      /**
       * In fact, user is not always defined but in most cases it is: only few routes not requiring auth don't have it.
       */
      user: LoggedUser
      log: Logger,
      duration?: number
    }
  }
}
