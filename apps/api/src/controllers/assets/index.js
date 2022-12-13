import { throwHTTPError } from '@/common/errors'

import {
  createAssetService,
  createAssetVulnerabilityService,
  deleteAssetService,
  deleteAssetsBulkService,
  fetchAssetPortsService,
  getAssetRiskService,
  importCsvService,
  searchAssetRevisionsService,
  searchAssetsBelongingService,
  searchAssetsService,
  updateAssetService,
  updateAssetsBulkService,
} from '@/services/assets'

export const searchAssets = async (req, res, next) => {
  try {
    const { error, asset, assets, total } = await searchAssetsService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.send(asset || { assets, total })
  }
  catch (error) {
    next(error)
  }
}

export const createAssetController = async (req, res, next) => {
  try {
    const { error, id } = await createAssetService(req.body, req.accessToken)

    if (error === 'DuplicateError')
      throw error
    if (error)
      throwHTTPError(error)
    res.send({ error, id })
  }
  catch (error) {
    if (error === 'DuplicateError')
      res.send({ error })

    next(error)
  }
}

export const deleteAssetController = async (req, res, next) => {
  try {
    const { error } = await deleteAssetService(req.params?.id, req.accessToken)
    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

export const createAssetVulnerabilityController = async (req, res, next) => {
  try {
    const { error } = await createAssetVulnerabilityService(
      req.params?.id,
      req.body,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

export const updateAssetController = async (req, res, next) => {
  try {
    const { error } = await updateAssetService(
      req.params?.id,
      req.body,
      req.accessToken,
    )
    if (error?.code >= 300)
      throw error
    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

export const updateAssetsBulkController = async (req, res, next) => {
  try {
    const { error, data } = await updateAssetsBulkService(
      req.body,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(201).send({ data })
  }
  catch (error) {
    next(error)
  }
}

export const deleteAssetsBulkController = async (req, res, next) => {
  try {
    const { error, status } = await deleteAssetsBulkService(
      req.body,
      req.accessToken,
    )
    if (error)
      throwHTTPError(error)

    res.status(201).send({ status })
  }
  catch (error) {
    next(error)
  }
}

export const searchAssetRevisionsController = async (req, res, next) => {
  try {
    const { error, revisions, total } = await searchAssetRevisionsService(
      req.params?.id,
      req.query,
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.send({ revisions, total })
  }
  catch (error) {
    next(error)
  }
}

export const importCsvController = async (req, res, next) => {
  try {
    const { pass, failed } = await importCsvService(req.body, req.accessToken)
    res.send({ failed, pass })
  }
  catch (error) {
    next(error)
  }
}

export const fetchAssetPortsController = async (req, res, next) => {
  try {
    const details = await fetchAssetPortsService(req.params.id, req.accessToken)
    if (details.error)
      throwHTTPError(details.error)
    res.send({ details })
  }
  catch (error) {
    next(error)
  }
}

export const searchAssetsBelongingController = async (req, res, next) => {
  try {
    const { error, assets, total } = await searchAssetsBelongingService(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.accessToken,
    )

    if (error)
      throwHTTPError(error)

    res.send({ assets, total })
  }
  catch (error) {
    next(error)
  }
}

export const getAssetRiskController = async (req, res, next) => {
  try {
    const result = await getAssetRiskService(req.params.id, req.accessToken)

    if ('error' in result)
      throwHTTPError(result.error)

    res.send(result)
  }
  catch (error) {
    next(error)
  }
}
