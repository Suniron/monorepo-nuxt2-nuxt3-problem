declare namespace Express {
  export interface Request {
    log: pino.Logger<pino.LoggerOptions>
  }
}
