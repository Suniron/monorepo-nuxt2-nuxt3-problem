/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} NextFunction
 */

import type { NextFunction, Request, Response } from 'express'
import { throwHTTPError } from '../../common/errors'
import {
  createCompanyModel,
  deleteCompanyLogoModel,
  getCompanyRiskModel,
  searchCompanyLogoModel,
  searchCompanyModel,
  updateCompanyLogoModel,
  updateCompanyModel,
} from '../../models/companies'

export const searchCompanyController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, company, companies, total } = await searchCompanyModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.send(company || { companies, total })
  }
  catch (error) {
    next(error)
  }
}

export const createCompanyController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, id } = await createCompanyModel(req.body, req.user)
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
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const searchCompanyLogoController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, logo } = await searchCompanyLogoModel(req.user)
    if (error)
      throwHTTPError(error)

    res.send({ logo })
  }
  catch (error) {
    next(error)
  }
}

export const updateCompanyLogoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, status } = await updateCompanyLogoModel(
      req.user,
      req.body.logo,
    )
    if (error)
      throwHTTPError(error)

    res.status(204).json(status)
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const deleteCompanyLogoController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, status } = await deleteCompanyLogoModel(req.user)
    if (error)
      throwHTTPError(error)

    res.status(200).json(status)
  }
  catch (error) {
    next(error)
  }
}

export const updateCompanyController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const { error, status } = await updateCompanyModel(req.user, req.body)
    if (error)
      throwHTTPError(error)
    res.status(200).json(status)
  }
  catch (error) {
    next(error)
  }
}

export const getCompanyRiskController = async (
  req: any,
  res: any,
  next: any,
) => {
  try {
    const result = await getCompanyRiskModel(req.user)
    if ('error' in result)
      throwHTTPError(result.error)
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }
}
