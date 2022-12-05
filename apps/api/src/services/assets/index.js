import { assetsAPIs } from '@/api/store'
import {
  SERVICE_ERROR,
  NOT_FOUND,
  VALIDATION_ERROR,
  SUCCESS,
} from '@/common/constants'
import { createServiceError } from '@/common/errors/service'

export const ipValidator = (ip) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  )

export const searchAssetsService = async (params, accessToken = '') => {
  const {
    id,
    ids,
    search,
    severities,
    tagIds,
    groupIds,
    types,
    attribute,
    page,
    pageSize,
  } = params
  const { error, asset, assets, total } = await assetsAPIs.searchAssets(
    {
      id,
      ids,
      search,
      severities,
      tagIds,
      groupIds,
      types,
      page,
      pageSize,
    },
    accessToken
  )

  if (error) return createServiceError(error)
  const formatAsset = (asset) => {
    let formattedAsset
    if (attribute) {
      formattedAsset = asset[attribute]
    } else {
      formattedAsset = {
        id: asset.id,
        name: asset.name,
        os: asset.os,
        hostname: asset.hostname,
        type: asset.type,
        url: asset.url,
        language: asset.language,
        position: asset.position,
        mail: asset.mail,
        phone_number: asset.phone_number,
        postal_address: asset.postal_address,
        tel: asset.tel,
        location: asset.location,
        relations: asset.relations,
        ips: asset.ips,
        revision: asset.revision,
        rev_cdate: asset.rev_cdate,
        netmask: asset.netmask,
        network: asset.network,
        gateway: asset.gateway,
        x: asset.x,
        y: asset.y,
        latitude: asset.latitude,
        longitude: asset.longitude,
        vulnerabilities: {
          low: asset.low_vulnerabilities || 0,
          medium: asset.medium_vulnerabilities || 0,
          high: asset.high_vulnerabilities || 0,
          critical: asset.critical_vulnerabilities || 0,
        },
        parents: asset.parents,
        owner: asset.owner,
        children: asset.children,
        last_update_date: asset.last_update_date,
        version: asset.version,
        tags: Array.isArray(asset.tags)
          ? asset.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color,
            }))
          : [],
        groups: Array.isArray(asset.groups)
          ? asset.groups.map((group) => ({
              id: group.id,
              name: group.name,
            }))
          : [],
      }

      if (asset.sitemap && asset.sitemap.length !== 0) {
        formattedAsset.sitemap = [
          {
            name: '/',
            children: [],
          },
        ]
        const addOrGetNode = (node, elt) => {
          const [c] = node.children.filter((n) => n.name == elt)
          if (c) return c
          else {
            node.children.push({ name: elt, children: [] })
            return node.children[node.children.length - 1]
          }
        }
        asset.sitemap.forEach((element) => {
          const nodes = element.uri.split('/')
          if (nodes.length !== 0) {
            let curNode = formattedAsset.sitemap[0]
            nodes.forEach((elt) => {
              if (elt !== '') curNode = addOrGetNode(curNode, elt)
            })
          }
        })
      }
    }
    return formattedAsset
  }

  return asset
    ? { asset: formatAsset(asset) }
    : {
        assets: assets.map(formatAsset),
        total,
      }
}

export const createAssetService = async (params, accessToken = '') => {
  const { name, type, assetData } = params
  let error, id
  const isValid = true
  /*  (type === 'SERVER' &&
      !assetData?.IPs?.some((elt) => !ipValidator(elt.address))) ||
    (type === 'WEB' && assetData.url) ||
    type === 'USER' ||
    type === 'BUILDING' ||
    (type === 'POLICY' &&
      assetData.revision &&
      assetData.doc &&
      assetData.cdate)*/

  if (isValid) {
    ;({ error, id } = await assetsAPIs.createAsset(
      { name, type, assetData },
      accessToken
    ))
  } else error = true
  if (error === 'DuplicateError') return { error: error }
  if (error) return { error: error }
  return { id }
}

export const deleteAssetService = async (id, accessToken = '') => {
  if (!id) return { error: VALIDATION_ERROR }

  const { error, status } = await assetsAPIs.deleteAsset(id, accessToken)
  if (error) {
    if (error === NOT_FOUND) return { error }
    return { error: error }
  }
  return { status: SUCCESS }
}

export const createAssetVulnerabilityService = async (
  id,
  params,
  accessToken = ''
) => {
  if (!id) return { error: VALIDATION_ERROR }
  const { error, status } = await assetsAPIs.createAssetVulnerability(
    id,
    params,
    accessToken
  )
  if (error) {
    if (error === NOT_FOUND) return { error }
    return { error: error }
  }
  return { status: SUCCESS }
}

export const updateAssetService = async (id, params, accessToken = '') => {
  if (!id) return { error: VALIDATION_ERROR }
  if (!params || !Object.entries(params).length) return { status: SUCCESS } // nothing to update

  const { error, status } = await assetsAPIs.updateAsset(
    id,
    params,
    accessToken
  )
  return error ? createServiceError(error) : { status: SUCCESS }
}

export const updateAssetsBulkService = async (params, accessToken = '') => {
  if (!params || !Object.entries(params).length) return { status: SUCCESS } // nothing to update
  Object.keys(params).forEach((elt) => {
    !params[elt] || params[elt] === '' || params[elt]?.length === 0
      ? delete params[elt]
      : undefined
  })
  Object.keys(params?.assetData || {}).forEach((elt) =>
    !params.assetData[elt] ||
    params.assetData[elt] === '' ||
    params.assetData[elt]?.length === 0
      ? delete params.assetData[elt]
      : undefined
  )
  const { error, data } = await assetsAPIs.updateAssetsBulk(params, accessToken)
  return error ? createServiceError(error) : { data: data }
}

export const deleteAssetsBulkService = async (params, accessToken = '') => {
  if (!params || !Object.entries(params).length) return { status: SUCCESS } // nothing to update
  const { error, status } = await assetsAPIs.deleteAssetsBulk(
    params,
    accessToken
  )
  return error ? createServiceError(error) : { status }
}

export const searchAssetRevisionsService = async (
  assetId,
  params,
  accessToken = ''
) => {
  const { error, revisions, total } = await assetsAPIs.searchAssetRevisions(
    assetId,
    params,
    accessToken
  )
  if (error) return createServiceError(error)

  const formatRevision = (revision) => ({
    revisionId: revision.id,
    documentId: revision.asset_document_id,
    revision: revision.revision,
    fileUUID: revision.store_id,
    fileName: revision.name,
    fileSize: revision.size,
    fileMd5: revision.md5,
    fileType: revision.type,
    fileUploadDate: revision.udate,
    creationDate: revision.cdate,
  })
  return {
    revisions: revisions.map(formatRevision),
    total,
  }
}

export const importCsvService = async (params, accessToken = '') => {
  const { headers, data } = params
  const result = []
  const relations = []
  const [nameIndex] = headers.filter(
    (elt) => (elt.key === 'name' && elt.csv.length === 1) || elt.default
  )
  const [typeIndex] = headers.filter(
    (elt) => (elt.key === 'type' && elt.csv.length === 1) || elt.default
  )
  const [osIndex] = headers.filter(
    (elt) => (elt.key === 'os' && elt.csv.length === 1) || elt.default
  )
  const [urlIndex] = headers.filter(
    (elt) => (elt.key === 'url' && elt.csv.length === 1) || elt.default
  )
  const [languageIndex] = headers.filter(
    (elt) => (elt.key === 'language' && elt.csv.length === 1) || elt.default
  )
  const [positionIndex] = headers.filter(
    (elt) => (elt.key === 'position' && elt.csv.length === 1) || elt.default
  )
  const [mailIndex] = headers.filter(
    (elt) => (elt.key === 'mail' && elt.csv.length === 1) || elt.default
  )
  const [telIndex] = headers.filter(
    (elt) => (elt.key === 'tel' && elt.csv.length === 1) || elt.default
  )
  const [addressIndex] = headers.filter(
    (elt) => elt.key === 'address' || elt.default
  )
  const [macIndex] = headers.filter((elt) => elt.key === 'mac' || elt.default)
  const [maskIndex] = headers.filter((elt) => elt.key === 'mask' || elt.default)
  const [ifaceIndex] = headers.filter(
    (elt) => elt.key === 'iface' || elt.default
  )
  const [maintainerIndex] = headers.filter(
    (elt) => elt.key === 'maintainer' || elt.default
  )
  const [ownerIndex] = headers.filter(
    (elt) => elt.key === 'owner' || elt.default
  )
  const [locationIndex] = headers.filter(
    (elt) => elt.key === 'location' || elt.default
  )
  const fetchSingleValue = (keyIndex, elt) => {
    return keyIndex?.csv ? elt[keyIndex.csv[0]] : keyIndex?.default || undefined
  }
  const fetchRelations = (keyIndex, nameIndex, mailIndex, data, elt) => {
    let tmp
    return keyIndex?.csv
      ? keyIndex.csv.reduce((res, eltCsv) => {
          if (elt[eltCsv])
            res.push(
              (tmp = data.findIndex(
                (d) =>
                  d[nameIndex.csv[0]]?.toLowerCase() ===
                    elt[eltCsv]?.toLowerCase() ||
                  d[mailIndex.csv[0]]?.toLowerCase() ===
                    elt[eltCsv]?.toLowerCase()
              )) === -1
                ? elt[eltCsv]
                : tmp
            )
          return res
        }, [])
      : keyIndex?.default
      ? keyIndex.default.reduce((res, eltCsv) => {
          if (elt[eltCsv])
            res.push(
              (tmp = data.findIndex(
                (d) =>
                  d[nameIndex.default[0]]?.toLowerCase() ===
                    elt[eltCsv]?.toLowerCase() ||
                  d[mailIndex.default[0]]?.toLowerCase() ===
                    elt[eltCsv]?.toLowerCase()
              )) === -1
                ? elt[eltCsv]
                : tmp
            )
          return res
        }, [])
      : []
  }
  data.forEach((elt, index) => {
    result.push({
      name: fetchSingleValue(nameIndex, elt),
      type: fetchSingleValue(typeIndex, elt),
      assetData: {
        os: fetchSingleValue(osIndex, elt),
        url: fetchSingleValue(urlIndex, elt),
        language: fetchSingleValue(languageIndex, elt),
        position: fetchSingleValue(positionIndex, elt),
        mail: fetchSingleValue(mailIndex, elt),
        tel: fetchSingleValue(telIndex, elt),
        IPs: addressIndex?.csv
          ? addressIndex.csv.reduce((res, element, index) => {
              if (elt[element])
                res.push({
                  address: elt[element],
                  mac: macIndex?.csv
                    ? elt[macIndex.csv[index]]
                    : macIndex?.default
                    ? elt[macIndex.default[index]]
                    : undefined,
                  iface: ifaceIndex?.csv
                    ? elt[ifaceIndex.csv[index]]
                    : ifaceIndex?.default
                    ? elt[ifaceIndex.default[index]]
                    : undefined,
                  mask: maskIndex?.csv
                    ? elt[maskIndex.csv[index]]
                    : maskIndex?.default
                    ? elt[maskIndex.default[index]]
                    : undefined,
                })
              return res
            }, [])
          : undefined,
      },
    })
    if (result[result.length - 1].type === 'BUILDING')
      result[result.length - 1].assetData.location = fetchSingleValue(
        locationIndex,
        elt
      )
    relations.push({
      index: index,
      LOCATED_TO:
        result[result.length - 1].type !== 'BUILDING'
          ? fetchRelations(locationIndex, nameIndex, mailIndex, data, elt)[0]
          : undefined,
      MAINTAINED_BY: fetchRelations(
        maintainerIndex,
        nameIndex,
        mailIndex,
        data,
        elt
      ),
      OWN_BY: fetchRelations(ownerIndex, nameIndex, mailIndex, data, elt),
    })
  })
  const { pass, failed } = await assetsAPIs.importCSV(
    { assets: result, relations: relations },
    accessToken
  )
  return { pass: pass, failed: failed }
}

export const fetchAssetPortsService = async (assetId, accessToken = '') => {
  const detais = await assetsAPIs.fetchAssetPorts(assetId, accessToken)
  return detais
}

export const searchAssetsBelongingService = async (
  search,
  accessToken = ''
) => {
  const assets = await assetsAPIs.searchAssetsBelonging(search, accessToken)
  return assets
}

export const getAssetRiskService = async (assetId, accessToken = '') => {
  const risk = await assetsAPIs.getAssetRisk(assetId, accessToken)
  return risk
}
