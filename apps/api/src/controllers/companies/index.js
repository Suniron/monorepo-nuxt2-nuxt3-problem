// @ts-check
import { throwHTTPError } from '@/common/errors'
import {
  createCompanyService,
  deleteCompanyLogoService,
  getCompanyRiskService,
  searchCompaniesService,
  searchCompanyLogoService,
  updateCompanyLogoService,
  updateCompanyService,
} from '@/services/companies'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchCompanyController = async (req, res, next) => {
  try {
    const { error, company, companies, total } = await searchCompaniesService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.send(company || { companies, total })
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createCompanyController = async (req, res, next) => {
  try {
    const { error, id } = await createCompanyService(req.body, req.accessToken)
    if (error)
      throwHTTPError(error)

    res.send({ id })
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchCompanyLogoController = async (req, res, next) => {
  try {
    const { error, logo } = await searchCompanyLogoService(
      req.body,
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.send({ logo })
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateCompanyLogoController = async (req, res, next) => {
  try {
    const { error, status } = await updateCompanyLogoService(
      req.body,
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.status(204).send(status)
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteCompanyLogoController = async (req, res, next) => {
  try {
    const { error, status } = await deleteCompanyLogoService(
      req.user,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(200).send(status)
  }
  catch (error) {
    next(error)
  }
}

export const updateCompanyController = async (req, res, next) => {
  try {
    const { error, status } = await updateCompanyService(
      req.body,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(200).send(status)
  }
  catch (error) {
    next(error)
  }
}

export const getCompanyRiskController = async (req, res, next) => {
  try {
    const result = await getCompanyRiskService(req.accessToken)
    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}