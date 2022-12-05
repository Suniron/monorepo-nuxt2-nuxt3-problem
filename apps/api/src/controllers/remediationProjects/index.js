import { throwHTTPError } from '@/common/errors'
import {
  getRemediationProjectsSummaryService,
  getRemediationProjectsService,
  createRemediationProjectsService,
  updateRemediationProjectsService,
  getRemediationProjectStatusHistoryService,
  getRemediationProjectsScopeService,
  updateRemediationProjectScopeService,
  updateRemediationProjectScopeItemService,
  getRemediationProjectCommentsService,
} from '@/services/remediationProjects'

export const getRemediationProjectsSummaryController = async (
  req,
  res,
  next
) => {
  try {
    const data = await getRemediationProjectsSummaryService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const getRemediationProjectsController = async (req, res, next) => {
  try {
    const data = await getRemediationProjectsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )

    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const getRemediationProjectStatusHistoryController = async (
  req,
  res,
  next
) => {
  try {
    const data = await getRemediationProjectStatusHistoryService(
      req.params.id,
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const updateRemediationProjectsController = async (req, res, next) => {
  try {
    const data = await updateRemediationProjectsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const getRemediationProjectsScopeController = async (req, res, next) => {
  try {
    const data = await getRemediationProjectsScopeService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const updateRemediationProjectScopeController = async (
  req,
  res,
  next
) => {
  try {
    const data = await updateRemediationProjectScopeService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const updateRemediationProjectScopeItemController = async (
  req,
  res,
  next
) => {
  try {
    const data = await updateRemediationProjectScopeItemService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.body,
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const getRemediationProjectComments = async (req, res, next) => {
  try {
    const data = await getRemediationProjectCommentsService(
      req.params.id,
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}

export const createRemediationProjectsController = async (req, res, next) => {
  try {
    const data = await createRemediationProjectsService(
      {
        ...(req.body || {}),
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken
    )
    if (data.error) throwHTTPError(data.error)
    res.send(data)
  } catch (error) {
    next(error)
  }
}
