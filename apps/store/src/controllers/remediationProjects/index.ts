

import { throwHTTPError } from '../../common/errors/index.js'
import {
  getRemediationProjectsModel,
  getRemediationProjectsSummaryModel,
  getRemediationProjectsScopeModel,
  updateRemediationProjectsModel,
  updateRemediationProjectScopeModel,
  updateRemediationProjectScopeItemModel,
  createRemediationProjectsModel,
  getRemediationProjectStatusHistoryModel,
  getRemediationProjectCommentsModel,

} from '../../models/remediationProjects'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getRemediationProjectsController = async (req: any, res: any, next: any) => {
  try {
    const result = await getRemediationProjectsModel(
      Number(req.params.id),
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getRemediationProjectsSummaryController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await getRemediationProjectsSummaryModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getRemediationProjectsScopeController = async (req: any, res: any, next: any) => {
  try {
    const result = await getRemediationProjectsScopeModel(
      Number(req.params.id),
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getRemediationProjectStatusHistoryController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await getRemediationProjectStatusHistoryModel(
      Number(req.params.id),
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateRemediationProjectsController = async (req: any, res: any, next: any) => {
  try {
    const result = await updateRemediationProjectsModel(
      Number(req.params.id),
      req.body,
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createRemediationProjectsController = async (req: any, res: any, next: any) => {
  try {
    const result = await createRemediationProjectsModel(req.body, req.user)

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateRemediationProjectScopeController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await updateRemediationProjectScopeModel(
      Number(req.params.id),
      req.body,
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.status(201).send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateRemediationProjectScopeItemController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await updateRemediationProjectScopeItemModel(
      Number(req.params.id),
      req.params.scopeId,
      req.body,
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getRemediationProjectCommentsController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await getRemediationProjectCommentsModel(
      Number(req.params.id),
      req.user
    )

    if ('error' in result) throwHTTPError(result.error)

    res.send(result)
  } catch (error) {
    next(error)
  }
}
