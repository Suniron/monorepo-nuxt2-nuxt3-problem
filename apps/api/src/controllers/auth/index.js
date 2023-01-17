// @ts-check
import nodeMailer from 'nodemailer'
import { NOT_FOUND } from '@/common/constants'
import env from '@/config/env'
import { throwHTTPError, throwUnauthorizedError } from '@/common/errors'
import getResetPasswordEmailTemplate from '@/template/email/resetPassword.js'
import {
  isAuthorizedService,
  loginService,
  logoutService,
  refreshAccessTokenService,
  sendResetPasswordMail,
  updateResetPasswordByToken,
} from '@/services/auth'
import { log } from '@/lib/logger'

export const jwtAuthParsing = (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader)
    return next() // continue without doing anything

  const token = authHeader.split(' ')[1]
  if (!token)
    return next() // continue without doing anything

  req.accessToken = token // keep the token in req object for easy access
  next()
}

export const loginController = async (req, res, next) => {
  try {
    const { error, accessToken, refreshTokenCookie, user, is2faInitialized } = await loginService(
      req.body,
    )
    if (error) {
      if (error === NOT_FOUND)
        throwUnauthorizedError()
      throwHTTPError(error)
    }

    res.set('Set-Cookie', refreshTokenCookie)
    res.status(201).send({ accessToken, is2faInitialized, user })
  }
  catch (error) {
    next(error)
  }
}

export const refreshAccessTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.rt
    const currentAccessToken = req.accessToken

    const { error, accessToken, user } = await refreshAccessTokenService(
      refreshToken,
      currentAccessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(201).send({ accessToken, user })
  }
  catch (error) {
    next(error)
  }
}

export const logoutController = async (req, res, next) => {
  try {
    const { error } = await logoutService(req.accessToken)
    res.set('Set-Cookie', 'rt=;;Path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;')
    if (error)
      throwHTTPError(error)
    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

export const isAuthorizedController = async (req, res, next) => {
  try {
    const { isAuthorized } = await isAuthorizedService(req.accessToken)
    if (isAuthorized)
      next()
    else res.status(401).send()
  }
  catch (error) {
    next(error)
  }
}

/**
 * // TODO: handle error with next()
 */
export const resetPassword = async (req, res) => {
  const mailOrUsername = req.body.username
  const { resetToken, email } = await sendResetPasswordMail({
    username: mailOrUsername,
  })

  if (!resetToken)
    return res.sendStatus(404)

  const transporter = nodeMailer.createTransport({
    auth: {
      pass: env.mailServer.MAIL_PASSWORD,
      user: env.mailServer.MAIL_LOGIN,
    },
    host: env.mailServer.MAIL_SERVER,
    port: env.mailServer.MAIL_PORT,
    secure: false,
  })

  const mailContent = getResetPasswordEmailTemplate(env.ui.origin, resetToken)
  const info = await transporter.sendMail({
    from: '"Xrator support" <no-reply@x-rator.cloud>',
    html: mailContent,
    subject: 'Reset password',
    to: `${email}`,
  })

  if (info.accepted[0] === email) {
    log.info(`Reset password email sent to ${email}`)
    return res.sendStatus(201)
  }

  log.warn(`Failed to send reset password email to ${email}`)
}

/**
 * // TODO: handle error with next()
 */
export const updatePasswordByToken = async (req, res) => {
  const { token, password } = req.body
  const response = await updateResetPasswordByToken({ password, token })
  if (response?.error)
    res.status(404).send(response.error)
  else res.status(response.status).send(response.statusText)
}
