import type { Application } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
// import { Strategy as TotpStrategy } from 'passport-totp'
import { doesPlaintextAndHashedPasswordMatch } from '../common/auth/passwords'
import { MODEL_ERROR, UNAUTHORIZED } from '../common/constants'
import { log } from '../lib/logger'
import { getUserByEmailOrUsername } from '../models/users'

export default async function loadPassport(app: Application) {
// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
// See https://github.com/jaredhanson/passport-totp/blob/master/examples/two-factor/server.js

  // == LocalStrategy (username + password) ==
  passport.use(new LocalStrategy((email, password, done) => {
    process.nextTick(async () => {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.

      // try {
      const { user, error } = await getUserByEmailOrUsername(email)
      if (error) {
        log.error(`Passport local stragtegy: error while getting user ${email}: ${error}`)
        return done(error, false, { message: 'An error occurred' })
      }
      // Check user exists
      else if (!user) {
        log.warn(`Passport local stragtegy: user ${email} not found`)
        return done(UNAUTHORIZED, false, { message: 'Invalid username or password' })
      }
      // Check user has password and salt (should never happen)
      else if (!user.password || !user.salt) {
        log.error(`Passport local stragtegy: error, the user ${user.id} has no password or salt`)
        return done(MODEL_ERROR, false, { message: 'An error occurred' })
      }
      // Check user good password
      else if (!doesPlaintextAndHashedPasswordMatch(password, user.password, user.salt)) {
        log.warn(`Passport local stragtegy: user ${user.id} has no password or salt or password doesn't match`)
        return done(UNAUTHORIZED, false, { message: 'Invalid username or password' })
      }

      // TODO: add analytics here ?
      // All good
      log.info(`Passport local stragtegy: user ${user.id} logged in`)
      return done(null, user)
      // }
      // catch (error) {
      //   return done('Error', false, { message: 'An error occurred' })
      // }
    })
  }))

  // == TotpStrategy (2FA) ==
  // passport.use(new TotpStrategy(
  //   (user, done) => {
  //   // setup function, supply key and period to done callback
  //     findKeyForUserId(user.id, (err, obj) => {
  //       if (err)
  //         return done(err)
  //       return done(null, obj.key, obj.period)
  //     })
  //   },
  // ))

  // Enable passport
  app.use(passport.initialize())
}

