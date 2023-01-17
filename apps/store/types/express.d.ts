import type { Logger } from "../src/lib/logger";
import type { JwtTokenPayload } from "../src/common/auth/jwt";

declare global {
  namespace Express {
    interface User extends JwtTokenPayload {

    }
    export interface Request {
      /**
       * In fact, user is not always defined but in most cases it is: only few routes not requiring auth don't have it.
       */
      // user: JwtTokenPayload
      log: Logger,
      duration?: number
    }
  }
}
