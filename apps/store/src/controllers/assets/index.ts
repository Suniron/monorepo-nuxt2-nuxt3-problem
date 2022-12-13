import type { NextFunction, Request, Response } from 'express'
import { DUPLICATE, SUCCESS } from '../../common/constants'

import { throwHTTPError } from '../../common/errors'
import {
  createAssetModel,
  createAssetVulnerabilityModel,
  createIpPortsModel,
  createUrisModel,
  deleteAssetModel,
  fetchAssetPortsModel,
  getAssetRiskModel,
  getAssetsSummary,
  searchAssetRevisions,
  searchAssetsBelongingModel,
  searchAssetsModel,
  updateAssetModel,
} from '../../models/assets'

import { createVulnerabilityModel } from '../../models/vulnerabilities'

export const searchAssetsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, asset, assets, total } = await searchAssetsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.send(asset || { assets, total })
  }
  catch (error) {
    req.log.withError(error).error('searchAssetsController')
    next(error)
  }
}

export const searchAssetsBelongingController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { error, assets, total } = await searchAssetsBelongingModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.send({ assets, total })
  }
  catch (error) {
    req.log.withError(error).error('searchAssetsBelongingController')
    next(error)
  }
}

export const createAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, id } = await createAssetModel(req.body, req.user)
    if (error === 'DuplicateError')
      res.status(400).send({ error })

    if (error)
      throwHTTPError(error)

    res.status(201).send({ id })
  }
  catch (error) {
    req.log.withError(error).error('createAssetController')
    next(error)
  }
}

export const deleteAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await deleteAssetModel(req.params?.id, req.user)

    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    req.log.withError(error).error('deleteAssetController')
    next(error)
  }
}

export const updateAssetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await updateAssetModel(req.params?.id, req.body, req.user)
    if (error === 'DuplicateError') {
      throwHTTPError(DUPLICATE)
      res.status(400).send({ error }).end()
    }

    if (error)
      throwHTTPError(error)

    res.status(204).end()
  }
  catch (error) {
    req.log.withError(error).error('updateAssetController')
    next(error)
  }
}

export const updateAssetsBulkController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { name, type, assets, assetData, tagIds, groupIds } = req.body
    if (assets.length === 0)
      throwHTTPError()
    const failed = []
    for (let i = 0; i < assets.length; i++) {
      const { error } = await updateAssetModel(
        assets[i],
        {
          assetData,
          groupIds,
          name,
          tagIds,
          type,
        },
        req.user,
      )
      if (error)
        failed.push({ error, id: assets[i] })
    }

    res.status(201).send({ failed })
  }
  catch (error) {
    req.log.withError(error).error('updateAssetsBulkController')
    next(error)
  }
}

export const deleteAssetsBulkController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { assets } = req.body
    if (assets.length === 0)
      throwHTTPError()
    for (let i = 0; i < assets.length; i++) {
      const { error } = await deleteAssetModel(assets[i], req.user)
      if (error)
        throwHTTPError(error)
    }

    res.status(204).end()
  }
  catch (error) {
    req.log.withError(error).error('deleteAssetsBulkController')
    next(error)
  }
}

export const searchAssetRevisionsController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { error, revisions, total } = await searchAssetRevisions(
      req.params?.id,
      req.query,
      req.user,
    )
    if (error)
      throwHTTPError(error)

    res.send({ revisions, total })
  }
  catch (error) {
    req.log.withError(error).error('searchAssetRevisionsController')
    next(error)
  }
}

export const getAssetsSummaryController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { error, summary } = await getAssetsSummary(req.user)
    if (error)
      throwHTTPError(error)

    res.send({ summary })
  }
  catch (error) {
    req.log.withError(error).error('getAssetsSummaryController')
    next(error)
  }
}

export const importCSVController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assets, relations } = req.body
    const failed = []
    let pass = 0
    let error, id
    for (let i = 0; i < assets.length; i++) {
      ({ error, id } = await createAssetModel(assets[i], req.user))
      if (error) {
        failed.push({ ...assets[i], error })
      }
      else {
        pass += 1
        assets[i].id = id
      }
      error = undefined
    }

    const fetchIdFromRelation = async (elt: any) => {
      let res
      if (
        typeof elt === 'string'
        // TODO: refactor this
        // eslint-disable-next-line no-cond-assign
        && (res = await searchAssetsModel({ search: elt }, req.user))
        && res.total === 1
      ) {
        return res.assets[0].id
      }
      else if (typeof elt === 'number' && assets[elt].id) {
        return assets[elt].id
      }
      else {
        failed.push({
          error: 'Unable to find the coressponding asset',
          relation: elt,
        })
        return undefined
      }
    }
    for (let i = 0; i < relations.length; i++) {
      const keys = Object.keys(relations[i]).filter(e => e !== 'index')
      for (let j = 0; j < keys.length; j++) {
        if (typeof relations[i][keys[j]] === 'object') {
          relations[i][keys[j]] = await Promise.all(
            relations[i][keys[j]].map(async (e: any) => {
              return await fetchIdFromRelation(e)
            }),
          )
        }
        else {
          relations[i][keys[j]] = await fetchIdFromRelation(
            relations[i][keys[j]],
          )
        }
      }

      ({ error } = await updateAssetModel(
        assets[relations[i].index].id,
        { assetData: relations[i] },
        req.user,
      ))
      error = undefined
    }
    res.send({ failed, pass })
  }
  catch (error) {
    req.log.withError(error).error('importCSVController')
    next(error)
  }
}

export const fetchAssetPortsController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  try {
    const { error, details } = await fetchAssetPortsModel(
      req.params.id,
      req.user,
    )

    if (error)
      throwHTTPError(error)

    res.send({ details })
  }
  catch (error) {
    req.log.withError(error).error('fetchAssetPortsController')
    next(error)
  }
}

export const createAssetVulnerabilityController = async (
  req: Request, res: Response, next: NextFunction,
) => {
  req.body.custom_description = req.body.description
  req.body.custom_remediation = req.body.remediation

  try {
    const assetId = req.params.id
    const { ips = [] } = req.body
    const { uris = [] } = req.body
    let vulnerability_id = req.body.vulnerability_id
    // TODO: find why it's unused
    // let newVuln = false
    if (!vulnerability_id)
      vulnerability_id = await createVulnerabilityModel(req.body, req.user)
    // newVuln = true

    let hasIp = false
    let hasUri = false
    for (const idx in ips) {
      hasIp = true
      await createIpPortsModel(assetId, ips[idx], req.user)
      let hasPort = false
      for (const pidx in ips[idx].ports) {
        hasPort = true
        await createAssetVulnerabilityModel(
          assetId,
          vulnerability_id,
          {
            ...req.body,
            ip_id: ips[idx].ip_id,
            port_id: ips[idx].ports[pidx].id,
          },
          req.user,
        )
      }
      if (!hasPort) {
        await createAssetVulnerabilityModel(
          assetId,
          vulnerability_id,
          { ...req.body, ip_id: ips[idx].ip_id },
          req.user,
        )
      }
    }
    if (uris.length > 0) {
      for (const idx of uris) {
        hasUri = true
        const uri_id = await createUrisModel(assetId, idx, req.user)
        if (uri_id) {
          await createAssetVulnerabilityModel(
            assetId,
            vulnerability_id,
            {
              ...req.body,
              uri_id,
            },
            req.user,
          )
        }
      }
    }
    if (!hasIp && !hasUri) {
      await createAssetVulnerabilityModel(
        assetId,
        vulnerability_id,
        { ...req.body },
        req.user,
      )
    }

    res.send({ status: SUCCESS })
  }
  catch (error) {
    req.log.withError(error).error('createAssetVulnerabilityController')
    next(error)
  }
}

export const getAssetRiskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user.companyId
    const assetId = parseInt(req.params.id)

    const risk = await getAssetRiskModel(companyId, assetId)
    if ('error' in risk)
      return throwHTTPError(risk.error)

    res.send(risk)
  }
  catch (error) {
    req.log.withError(error).error('getAssetRiskController')
    next(error)
  }
}
