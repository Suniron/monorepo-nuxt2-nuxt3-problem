import type { NextFunction, Request, Response } from 'express'
import type { JwtTokenPayload } from '../../common/auth/jwt'
import { throwHTTPError } from '../../common/errors/'
import {
  createRemediationProjectsModel,
  getRemediationProjectCommentsModel,
  getRemediationProjectStatusHistoryModel,
  getRemediationProjectsModel,
  getRemediationProjectsScopeModel,
  getRemediationProjectsSummaryModel,
  updateRemediationProjectScopeItemModel,
  updateRemediationProjectScopeModel,
  updateRemediationProjectsModel,
} from '../../models/remediationProjects'

export const getRemediationProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getRemediationProjectsModel(
      Number(req.params.id),
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const getRemediationProjectsSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getRemediationProjectsSummaryModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const getRemediationProjectsScopeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getRemediationProjectsScopeModel(
      Number(req.params.id),
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const getRemediationProjectStatusHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getRemediationProjectStatusHistoryModel(
      Number(req.params.id),
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const updateRemediationProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateRemediationProjectsModel(
      Number(req.params.id),
      req.body,
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const createRemediationProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createRemediationProjectsModel(req.body, req.user as JwtTokenPayload)

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}

export const updateRemediationProjectScopeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateRemediationProjectScopeModel(
      Number(req.params.id),
      req.body,
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.status(201).send(result)
  }
  catch (error) {
    next(error)
  }
}

export const updateRemediationProjectScopeItemController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateRemediationProjectScopeItemModel(
      Number(req.params.id),
      req.params.scopeId,
      req.body,
      req.user as JwtTokenPayload,
    )
    if ('error' in result)
      throwHTTPError(result.error)

    res.status(204).send()
  }
  catch (error) {
    next(error)
  }
}

export const getRemediationProjectCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getRemediationProjectCommentsModel(
      Number(req.params.id),
      req.user as JwtTokenPayload,
    )

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}
