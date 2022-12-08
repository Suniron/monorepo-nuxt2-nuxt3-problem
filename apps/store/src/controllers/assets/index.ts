// @ts-check

// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { DUPLICATE, SUCCESS } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
import {
  searchAssetsModel,
  createAssetModel,
  deleteAssetModel,
  updateAssetModel,
  searchAssetRevisions,
  getAssetsSummary,
  fetchAssetPortsModel,
  createAssetVulnerabilityModel,
  createIpPortsModel,
  createUrisModel,
  searchAssetsBelongingModel,
  getAssetRiskModel,
// @ts-expect-error TS(2307): Cannot find module '@/models/assets' or its corres... Remove this comment to see the full error message
} from '@/models/assets'
// @ts-expect-error TS(2307): Cannot find module '@/models/vulnerabilities' or i... Remove this comment to see the full error message
import { createVulnerabilityModel } from '@/models/vulnerabilities'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchAssetsController = async (req: any, res: any, next: any) => {
  try {
    const { error, asset, assets, total } = await searchAssetsModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send(asset || { assets, total })
  } catch (error) {
    req.log.withError(error).log('searchAssetsController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchAssetsBelongingController = async (req: any, res: any, next: any) => {
  try {
    const { error, assets, total } = await searchAssetsBelongingModel(
      {
        ...(req.params || {}),
        ...(req.query || {}),
      },
      req.user
    )

    if (error) throwHTTPError(error)

    res.send({ assets, total })
  } catch (error) {
    req.log.withError(error).log('searchAssetsBelongingController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createAssetController = async (req: any, res: any, next: any) => {
  try {
    const { error, id } = await createAssetModel(req.body, req.user)
    if (error === 'DuplicateError') {
      res.status(400).send({ error })
    }
    if (error) throwHTTPError(error)

    res.status(201).send({ id })
  } catch (error) {
    req.log.withError(error).log('createAssetController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteAssetController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await deleteAssetModel(req.params?.id, req.user)

    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    req.log.withError(error).log('deleteAssetController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateAssetController = async (req: any, res: any, next: any) => {
  try {
    const { error } = await updateAssetModel(req.params?.id, req.body, req.user)
    if (error === 'DuplicateError') {
      throwHTTPError(DUPLICATE)
      res.status(400).send({ error }).end()
    }

    if (error) throwHTTPError(error)

    res.status(204).end()
  } catch (error) {
    req.log.withError(error).log('updateAssetController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateAssetsBulkController = async (req: any, res: any, next: any) => {
  try {
    const { name, type, assets, assetData, tagIds, groupIds } = req.body
    if (assets.length === 0) throwHTTPError()
    const failed = []
    for (let i = 0; i < assets.length; i++) {
      const { error } = await updateAssetModel(
        assets[i],
        {
          name: name,
          type: type,
          assetData: assetData,
          tagIds: tagIds,
          groupIds: groupIds,
        },
        req.user
      )
      if (error) failed.push({ id: assets[i], error: error })
    }

    res.status(201).send({ failed: failed })
  } catch (error) {
    req.log.withError(error).log('updateAssetsBulkController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteAssetsBulkController = async (req: any, res: any, next: any) => {
  try {
    const { assets } = req.body
    if (assets.length === 0) throwHTTPError()
    for (let i = 0; i < assets.length; i++) {
      const { error } = await deleteAssetModel(assets[i], req.user)
      if (error) throwHTTPError(error)
    }

    res.status(204).end()
  } catch (error) {
    req.log.withError(error).log('deleteAssetsBulkController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchAssetRevisionsController = async (req: any, res: any, next: any) => {
  try {
    const { error, revisions, total } = await searchAssetRevisions(
      req.params?.id,
      req.query,
      req.user
    )
    if (error) throwHTTPError(error)

    res.send({ revisions, total })
  } catch (error) {
    req.log.withError(error).log('searchAssetRevisionsController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getAssetsSummaryController = async (req: any, res: any, next: any) => {
  try {
    const { error, summary } = await getAssetsSummary(req.user)
    if (error) throwHTTPError(error)

    res.send({ summary })
  } catch (error) {
    req.log.withError(error).log('getAssetsSummaryController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const importCSVController = async (req: any, res: any, next: any) => {
  try {
    const { assets, relations } = req.body
    const failed = []
    let pass = 0
    let error, id
    for (let i = 0; i < assets.length; i++) {
      // eslint-disable-next-line prettier/prettier
      ({ error, id } = await createAssetModel(assets[i], req.user))
      if (error) failed.push({ ...assets[i], error: error })
      else {
        pass += 1
        assets[i].id = id
      }
      error = undefined
    }

    const fetchIdFromRelation = async (elt: any) => {
      let res
      if (
        typeof elt === 'string' &&
        (res = await searchAssetsModel({ search: elt }, req.user)) &&
        res.total === 1
      ) {
        return res.assets[0].id
      } else if (typeof elt === 'number' && assets[elt].id) {
        return assets[elt].id
      } else {
        failed.push({
          relation: elt,
          error: 'Unable to find the coressponding asset',
        })
        return undefined
      }
    }
    for (let i = 0; i < relations.length; i++) {
      const keys = Object.keys(relations[i]).filter((e) => e !== 'index')
      for (let j = 0; j < keys.length; j++) {
        if (typeof relations[i][keys[j]] === 'object') {
          relations[i][keys[j]] = await Promise.all(
            relations[i][keys[j]].map(async (e: any) => {
              return await fetchIdFromRelation(e)
            })
          )
        } else {
          relations[i][keys[j]] = await fetchIdFromRelation(
            relations[i][keys[j]]
          )
        }
      }

      // eslint-disable-next-line prettier/prettier
      ({ error } = await updateAssetModel(
        assets[relations[i].index].id,
        { assetData: relations[i] },
        req.user
      ))
      error = undefined
    }
    res.send({ pass: pass, failed: failed })
  } catch (error) {
    req.log.withError(error).log('importCSVController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const fetchAssetPortsController = async (req: any, res: any, next: any) => {
  try {
    const { error, details } = await fetchAssetPortsModel(
      req.params.id,
      req.user
    )

    if (error) throwHTTPError(error)

    res.send({ details })
  } catch (error) {
    req.log.withError(error).log('fetchAssetPortsController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createAssetVulnerabilityController = async (req: any, res: any, next: any) => {
  req.body.custom_description = req.body.description
  req.body.custom_remediation = req.body.remediation

  try {
    const assetId = req.params.id
    const { ips = [] } = req.body
    const { uris = [] } = req.body
    let vulnerability_id = req.body.vulnerability_id
    // TODO: find why it's unused
    // let newVuln = false
    if (!vulnerability_id) {
      vulnerability_id = await createVulnerabilityModel(req.body, req.user)
      // newVuln = true
    }
    let hasIp = false
    let hasUri = false
    for (let idx in ips) {
      hasIp = true
      await createIpPortsModel(assetId, ips[idx], req.user)
      let hasPort = false
      for (let pidx in ips[idx].ports) {
        hasPort = true
        await createAssetVulnerabilityModel(
          assetId,
          vulnerability_id,
          {
            ...req.body,
            ip_id: ips[idx].ip_id,
            port_id: ips[idx].ports[pidx].id,
          },
          req.user
        )
      }
      if (!hasPort) {
        await createAssetVulnerabilityModel(
          assetId,
          vulnerability_id,
          { ...req.body, ip_id: ips[idx].ip_id },
          req.user
        )
      }
    }
    if (uris.length > 0)
      for (let idx of uris) {
        hasUri = true
        const uri_id = await createUrisModel(assetId, idx, req.user)
        if (uri_id) {
          await createAssetVulnerabilityModel(
            assetId,
            vulnerability_id,
            {
              ...req.body,
              uri_id: uri_id,
            },
            req.user
          )
        }
      }
    if (!hasIp && !hasUri) {
      await createAssetVulnerabilityModel(
        assetId,
        vulnerability_id,
        { ...req.body },
        req.user
      )
    }

    res.send({ status: SUCCESS })
  } catch (error) {
    req.log.withError(error).error('createAssetVulnerabilityController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getAssetRiskController = async (req: any, res: any, next: any) => {
  try {
    const companyId = req.user.companyId
    const assetId = parseInt(req.params.id)
    const risk = await getAssetRiskModel(companyId, assetId)
    if ('error' in risk) {
      return throwHTTPError(risk.error)
    }

    res.send(risk)
  } catch (error) {
    req.log.withError(error).error('getAssetRiskController')
    next(error)
  }
}
