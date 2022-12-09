import {
  createScanAssetModel,
  createScanModel,
  getScanModel,
  getScanReportModel,
  searchAssetScanModel,
  searchPhishingScenariosModel,
  searchScansModel,
  updateScanModel,

} from '../../models/scans'
import {
  createVulnerabilityModel,
  searchVulnerabilitiesModel,
  updateVulnerabilityModel,

} from '../../models/vulnerabilities'
import {
  createAssetModel,
  createAssetVulnerabilityModel,
  searchAssetVulnerabilityModel,
  searchAssetsModel,
  updateAssetModel,
  updateAssetVulnerabilityModel,

} from '../../models/assets'
import {
  addCartographyElementModel,
  createCartographyModel,

} from '../../models/cartography'

import { createRelationModel } from '../../models/relations'

import { throwBadRequestError } from '../../common/errors'

import { knex } from '../../common/db'

import { SUCCESS } from '../../common/constants'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchScans = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error, scans, total } = await searchScansModel(
      provider,
      req.query,
      req.user,
    )

    if (error)
      throwBadRequestError()

    res.send({ scans, total })
  }
  catch (error) {
    req.log.withError(error).error('searchScans')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getScanController = async (req: any, res: any, next: any) => {
  const provider = {
    knex,
    logger: console,
  }
  try {
    const { error, scan } = await getScanModel(provider, req.params, req.user)

    if (error)
      throwBadRequestError()

    res.send(scan)
  }
  catch (error) {
    req.log.withError(error).error('getScanController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateScanController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    await updateScanModel(provider, req.params.scanId, req.body, req.user)
    res.send()
  }
  catch (error) {
    req.log.withError(error).error('updateScanController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchAssetScanController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error, assets } = await searchAssetScanModel(provider, req.user)

    if (error)
      throwBadRequestError()

    res.send({ assets })
  }
  catch (error) {
    req.log.withError(error).error('searchAssetScanController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchPhishingScenariosController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error, scenarios } = await searchPhishingScenariosModel(provider)

    if (error)
      throwBadRequestError()

    res.send(scenarios)
  }
  catch (error) {
    req.log.withError(error).error('searchPhishingScenariosController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getScanReportController = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error, scanReport } = await getScanReportModel(provider, req.params)

    if (error)
      throwBadRequestError()

    res.send(scanReport)
  }
  catch (error) {
    req.log.withError(error).error('getScanReportController')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createScan = async (req: any, res: any, next: any) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error, id } = await createScanModel(provider, req.body, req.user)

    if (error)
      throwBadRequestError()

    res.send({ id })
  }
  catch (error) {
    req.log.withError(error).error('createScan')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const parseScanResultController = async (req: any, res: any, next: any) => {
  try {
    const { hosts, vulns, name, addToCy = null, cyId = null } = req.body
    const provider = {
      knex,
      logger: console,
    }
    let cy
    if (addToCy) {
      cy
        = parseInt(cyId)
        || (await createCartographyModel({ name }, req.user))
    }
    const restTmp = await createScanModel(
      provider,
      {
        name,
        scanParams: { assets: [], userAssets: [] },
        status: 'Completed and Processed',
        type: ['manual'],
      },
      req.user,
    )
    const scanId = restTmp.id[0]
    const registeredPorts: any = []
    for (const element in vulns) {
      const { vulnerabilities, total } = await searchVulnerabilitiesModel(
        { search: element },
        req.user,
      )
      if (total > 0) {
        vulns[element].id = vulnerabilities[0].id
        await updateVulnerabilityModel(
          vulnerabilities[0].id,
          vulns[element],
          req.user,
        )
      }
      else {
        const id = await createVulnerabilityModel(
          { burp_id: element, oid: element, ...vulns[element] },
          req.user,
        )
        vulns[element].id = id
      }
    }
    for (const elt in hosts) {
      const { assets } = await searchAssetsModel(
        { search: elt, strict: true },
        req.user,
      )
      if (hosts[elt].type === 'SERVER')
        hosts[elt].IPs = [{ address: elt }]
      const fhostname = Array.isArray(hosts[elt]?.hostname)
        ? hosts[elt]?.hostname[0]
        : typeof hosts[elt]?.hostname === 'string'
          ? hosts[elt]?.hostname
          : null
      if (Array.isArray(hosts[elt]?.hostname))
        hosts[elt].hostname = hosts[elt].hostname.join(' / ')
      if (assets.length === 1) {
        hosts[elt].id = assets[0].id
        await updateAssetModel(
          hosts[elt].id,
          {
            assetData: hosts[elt],
            name: fhostname || elt,
            type: hosts[elt].type,
          },
          req.user,
        )
      }
      else {
        const assetId = await createAssetModel(
          {
            assetData: hosts[elt],
            name: fhostname || elt,
            type: hosts[elt].type,
          },
          req.user,
        )
        hosts[elt].id = assetId.id
      }
      const { astVulns } = hosts[elt]
      let oldVulns = await searchAssetVulnerabilityModel(
        hosts[elt].id,
        null,
        {},
        req.user,
      )
      if (!Array.isArray(oldVulns))
        oldVulns = [{ id: oldVulns }]
      let scanWithVuln = false
      for (const vuln in astVulns) {
        scanWithVuln = true
        const assetId = hosts[elt].id
        const vulnId = vulns[astVulns[vuln].vuln_id].id
        const ipId = hosts[elt].IPs[0].id
        const portId
          = astVulns[vuln].port === undefined
            ? null
            : astVulns[vuln].port.startsWith('general')
              ? null
              : hosts[elt].ports[astVulns[vuln].port].id
        let assetVuln = await searchAssetVulnerabilityModel(
          assetId,
          vulnId,
          {
            ipId,
            portId,
          },
          req.user,
        )
        if (Array.isArray(assetVuln))
          assetVuln = assetVuln[0]
        if (!assetVuln) {
          [assetVuln] = await createAssetVulnerabilityModel(
            assetId,
            vulnId,
            { ip_id: ipId, port_id: portId, ...astVulns[vuln] },
            req.user,
          )
        }
        else {
          await updateAssetVulnerabilityModel(
            assetVuln,
            { ip_id: ipId, port_id: portId, ...astVulns[vuln] },
            req.user,
          )
        }
        await createScanAssetModel(
          provider,
          {
            asset_id: assetId,
            ip_id: ipId,
            port_id: portId,
            scan_id: scanId,
            vulnerability_asset_id: assetVuln,
          },
          req.user,
        )
        registeredPorts.push(portId)
        oldVulns = oldVulns.filter((e: any) => e.id !== assetVuln)
      }
      if (scanWithVuln) {
        for (const oidx in oldVulns) {
          await updateAssetVulnerabilityModel(
            oldVulns[oidx].id,
            {
              status: 'closed',
              statusComment: 'Vulnerbility not detected by latest scan',
            },
            req.user,
          )
        }
      }
      const toRegister
        = hosts[elt].ports === undefined
          ? []
          : Object.keys(hosts[elt].ports).filter(
            p => !registeredPorts.includes(hosts[elt].ports[p].id),
          )
      for (const ridx in toRegister) {
        await createScanAssetModel(
          provider,
          {
            asset_id: hosts[elt].id,
            ip_id: hosts[elt].IPs[0].id,
            port_id: hosts[elt].ports[toRegister[ridx]].id,
            scan_id: scanId,
          },
          req.user,
        )
      }
      if (addToCy) {
        await addCartographyElementModel(
          cy,
          { asset_id: hosts[elt].id, cygroup: 'nodes' },
          req.user,
        )
        let origId
        for (const tidx in hosts[elt].trace) {
          const hop = hosts[elt].trace[tidx]
          const hopAssets = await searchAssetsModel(
            { search: hop, strict: true },
            req.user,
          )
          let hopAstId
          if (hopAssets.assets.length === 1) {
            hopAstId = hopAssets.assets[0].id
          }
          else {
            const assetId = await createAssetModel(
              {
                assetData: {},
                name: hop,
                type: 'SERVER',
              },
              req.user,
            )
            hopAstId = assetId.id
          }
          await addCartographyElementModel(
            cy,
            { asset_id: hopAstId, cygroup: 'nodes' },
            req.user,
          )
          if (tidx !== '0') {
            const relId = await createRelationModel(
              {
                from_asset_id: origId,
                to_asset_id: hopAstId,
                type: 'CONNECTED_TO',
              },
              req.user,
            )
            await addCartographyElementModel(
              cy,
              { cygroup: 'edges', relation_id: relId.id },
              req.user,
            )
          }
          origId = hopAstId
        }
      }
    }
    res.status(201).send({ status: SUCCESS })
  }
  catch (error) {
    req.log.withError(error).error('createScan')
    next(error)
  }
}

export default {
  createScan,
  searchScans,
}
