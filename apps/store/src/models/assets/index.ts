import type { asset, company } from '@prisma/client'
import type { Server } from '../../../types/asset'
import { knex } from '../../common/db'

import prismaClient from '../../prismaClient'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  VALIDATION_ERROR,
} from '../../common/constants'
import {
  getAssetVulnerabilitiesCountBySeverity,
  hasVulnerability,
  updateStatusModel,
} from '../../models/vulnerabilities'
import { getUserGroupIds } from '../../utils/user.utils'
import { SUPER_ASSET_TYPES, TECHNICAL_ASSET_TYPES } from '../../utils/assets'
import { log } from '../../lib/logger'
import { throwDuplicateError } from '../../common/errors'
import { createIpModel, searchIpModel, updateOrCreateIpModel } from './ip'
import { createUriModel, searchUriModel } from './uri'
import { createCpeModel, updateOrCreateCpeModel } from './cpe'
import {
  createPortModel,
  searchPortModel,
  updateOrCreatePortModel,
} from './port'
import { createCipherModel } from './cipher'
import { createCvssModel, updateCvssModel } from './cvss'

export const getAssetScores = async (
  companyId: company['id'],
  assetId: asset['id'],
) => {
  try {
    const scores = await prismaClient.v_asset_risk_scores.findFirst({
      where: {
        asset_id: assetId,
        company_id: companyId,
      },
    })

    if (!scores)
      return { error: NOT_FOUND }

    return { scores }
  }
  catch (error) {
    log.withError(error).error('getAssetScores error')
    return { error: MODEL_ERROR }
  }
}

export const getAssetRiskModel = async (
  companyId: company['id'],
  assetId: asset['id'],
) => {
  try {
    const { scores, error: scoreError } = await getAssetScores(
      companyId,
      assetId,
    )
    if (scoreError)
      return { error: scoreError }

    const { error: vulnError, vulnerabilitiesCount }
      = await getAssetVulnerabilitiesCountBySeverity(companyId, assetId)
    if (vulnError)
      return { error: vulnError }

    return {
      hasVulnerability: hasVulnerability(vulnerabilitiesCount),
      lastScanDate: scores.last_scan_date,
      scores: {
        compoundScore: scores.compound_score,
        inherentScore: scores.inherent_score,
        inheritedScore: scores.inherited_score,
      },
      vulnerabilitiesCount,
    }
  }
  catch (error) {
    log.withError(error).error('getAssetRiskModel error')
    return { error: MODEL_ERROR }
  }
}

/**
 * Returns a list of assets. If an ID is given, returns a single asset object instead.
 */
export const searchAssetsModel = async (params: {
  /**
   * ID of an asset
   */
  id: asset['id']
  /**
   * Asset IDs, separated by commas
   */
  ids: string
  /**
   * Search string used to search asset by name
   */
  search: string
  /**
   * Comma-separated string-array of severities. Filters asset by the specified
   * vulnerabilities' severities. Options: low, medium, high, critical
   */
  severities: string
  /**
   * Comma-separated string-array of tag IDs. Filters an asset by tag
   */
  tagIds: string
  /**
   * Comma-separated string-array of group IDs. Filter assets by group id
   */
  groupIds: string
}, loggedUserInfo: Express.LoggedUser) => {
  try {
    const { companyId, roles, id: userId } = loggedUserInfo
    const groups = await getUserGroupIds(userId)
    const query = knex
      .select({
        children: knex.raw('coalesce(agg_children.children, \'{}\')'),
        critical_vulnerabilities: knex.raw('agg_sev.critical'),
        gateway: 'anet.gateway',
        groups: knex.raw('coalesce(agg_group.groups, \'{}\')'),
        high_vulnerabilities: knex.raw('agg_sev.high'),
        hostname: 'asrv.hostname',
        id: 'ast.id',
        ips: knex.raw('coalesce(agg_ip.ips, \'{}\')'),
        language: 'aweb.language',
        last_update_date: 'asmi.last_update_date',
        latitude: 'abdg.latitude',
        location: 'abdg.location',
        longitude: 'abdg.longitude',
        low_vulnerabilities: knex.raw('agg_sev.low'),
        mail: 'ausr.mail',
        // Get the main IPs of the asset:
        mainIps: knex.raw('coalesce(agg_main_ip.ips, \'{}\')'),
        medium_vulnerabilities: knex.raw('agg_sev.medium'),
        name: 'ast.name',
        netmask: 'anet.netmask',
        network: 'anet.network',
        os: 'asrv.os',
        owner: 'user.first_name',
        parents: knex.raw('coalesce(agg_parents.parents, \'{}\')'),
        phone_number: 'abdg.phone_number',
        ports: knex.raw('coalesce(agg_port.ports, \'{}\')'),
        position: 'ausr.position',
        postal_address: 'abdg.postal_address',
        relations: knex.raw('coalesce(agg_rels.rels, \'{}\')'),
        rev_cdate: 'rev.cdate',
        revision: 'rev.revision',
        sitemap: knex.raw('coalesce(agg_sitemap.uris, \'{}\')'),
        tags: knex.raw('coalesce(agg_tag.tags, \'{}\')'),
        tel: 'ausr.tel',
        total_count: knex.raw('count(ast.id) over()'),
        type: 'ast.type',
        url: 'aweb.url',
        version: 'asmi.version',
      })
      .from({ ast: 'asset' })
      .leftJoin({ asmi: 'asset_mission' }, { 'asmi.id': 'ast.id' })
      .leftJoin({ user: 'user' }, { 'user.id': 'ast.owner' })
      .innerJoin({ cp: 'company' }, { 'ast.company_id': 'cp.id' })
      .leftJoin({ asrv: 'asset_server' }, { 'asrv.id': 'ast.id' })
      .leftJoin({ ip: 'ip' }, { 'ip.asset_server_id': 'asrv.id' })
      .leftJoin({ aweb: 'asset_web' }, { 'aweb.id': 'ast.id' })
      .leftJoin({ ausr: 'asset_user' }, { 'ausr.id': 'ast.id' })
      .leftJoin({ abdg: 'asset_building' }, { 'abdg.id': 'ast.id' })
      .leftJoin({ adoc: 'asset_document' }, { 'adoc.id': 'ast.id' })
      .leftJoin({ anet: 'asset_network' }, { 'anet.id': 'ast.id' })
      .leftJoin({ rev: 'revision' }, { 'rev.asset_document_id': 'adoc.id' })
      .where({ 'cp.id': companyId })
      .orderBy('ast.name')

    const parentsSubQuery = knex
      .select(
        'ass.id',
        'name',
        knex.raw('array_agg(json_build_object(\'id\', ac.parent_id)) as parents'),
      )
      .from('asset as ass')
      .groupBy('ass.id')
      .leftJoin('v_asset_child as ac', 'ass.id', 'ac.child_id')
      .as('agg_parents')

    const parentsJoinParams = [parentsSubQuery, 'agg_parents.id', 'ast.id']
    if (params.groupIds)
      query.innerJoin(...parentsJoinParams)
    else query.leftJoin(...parentsJoinParams)

    const childrenSubQuery = knex
      .select(
        'ass.id',
        'name',
        knex.raw('array_agg(json_build_object(\'id\', ac.child_id)) as children'),
      )
      .from('asset as ass')
      .groupBy('ass.id')
      .leftJoin('v_asset_child as ac', 'ass.id', 'ac.parent_id')
      .as('agg_children')
    /* It allow us to get the ID linked to the current asset
       I was not able to get the entire information, so i'll keep this ID and make a
       sql request to get more informations on the asset
    */
    const childrenJoinParams = [childrenSubQuery, 'agg_children.id', 'ast.id']
    if (params.groupIds)
      query.innerJoin(...childrenJoinParams)
    else query.leftJoin(...childrenJoinParams)

    // Subqueries
    const tagsSubquery = knex
      .select(
        'asset_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', tag.id, \'name\', tag.name, \'color\', tag.color)) as tags',
        ),
      )
      .from('tag_asset as atg')
      .innerJoin('tag', 'atg.tag_id', 'tag.id')
      .groupBy('asset_id')
      .as('agg_tag')

    const tagsJoinParams = [tagsSubquery, 'agg_tag.asset_id', 'ast.id']
    if (params.tagIds)
      query.innerJoin(...tagsJoinParams)
    else query.leftJoin(...tagsJoinParams)

    const groupsSubquery = knex
      .select(
        'asset_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', gast.group_id, \'name\', grp.name)) as groups',
        ),
      )
      .from('group_asset as gast')
      .innerJoin('group as grp', 'grp.id', 'gast.group_id')
      .groupBy('asset_id')
      .as('agg_group')

    const groupsJoinParams = [groupsSubquery, 'agg_group.asset_id', 'ast.id']
    if (params.groupIds)
      query.innerJoin(...groupsJoinParams)
    else query.leftJoin(...groupsJoinParams)
    // Severities Subquery
    const sevSubquery = knex
      .select({
        asset_id: 'asset_id',
        critical: knex.raw(
          'count(vast.id) filter (where LOWER(vast.severity) = \'critical\' or cvss.score >= 9)',
        ),
        high: knex.raw(
          'count(vast.id) filter (where LOWER(vast.severity) = \'high\' or (cvss.score >= 7 and cvss.score <= 8.9))',
        ),
        low: knex.raw(
          'count(vast.id) filter (where LOWER(vast.severity) = \'low\' or cvss.score <= 3.9)',
        ),
        medium: knex.raw(
          'count(vast.id) filter (where LOWER(vast.severity) = \'medium\' or (cvss.score >= 4 and cvss.score <= 6.9))',
        ),
      })
      .from('vulnerability_asset as vast')
      .leftJoin('cvss', { 'cvss.id': 'vast.cvss_id' })
      .whereRaw('status is NULL')
      .orWhereRaw('LOWER(status) = \'open\'')
      .groupBy('asset_id')
      .as('agg_sev')
    query.leftJoin(sevSubquery, { 'agg_sev.asset_id': 'ast.id' })

    // IPs subquery
    const ipsSubquery = knex
      .select(
        'asset_server_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', ip.id, \'address\', ip.address, \'mac\', ip.mac, \'iface\', ip.iface, \'mask\', ip.mask, \'isMain\', ip.is_main)) as ips',
        ),
      )
      .from('ip')
      .groupBy('asset_server_id')
      .as('agg_ip')
    query.leftJoin(ipsSubquery, { 'agg_ip.asset_server_id': 'ast.id' })

    // Main IPs subquery
    const mainIpsSubquery = knex
      .select(
        'asset_server_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', ip.id, \'address\', ip.address, \'mac\', ip.mac, \'iface\', ip.iface, \'mask\', ip.mask)) as ips',
        ),
      )
      .from('ip')
      .where('is_main', true)
      .groupBy('asset_server_id')
      .as('agg_main_ip')
    query.leftJoin(mainIpsSubquery, { 'agg_main_ip.asset_server_id': 'ast.id' })

    // Ports subquery
    const portsSubquery = knex
      .select(
        'ip_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', port.id, \'number\', port.number, \'protocol\', port.protocol, \'status\', port.status)) as ports',
        ),
      )
      .from('port')
      .groupBy('ip_id')
      .as('agg_port')
    query.leftJoin(portsSubquery, { 'agg_port.ip_id': 'ip.id' })

    // relations
    const relationsSubquery = knex
      .select(
        'from_asset_id',
        knex.raw(
          'array_agg(json_build_object(\'id\', from_asset_id, \'rel_id\', rel.id, \'type\', rel.type, \'name\', astto.name, \'asset_type\', astto.type, \'to_id\', rel.to_asset_id)) as rels',
        ),
      )
      .from('relation as rel')
      .innerJoin('asset as astto', { 'astto.id': 'rel.to_asset_id' })
      .groupBy('from_asset_id')
      .as('agg_rels')
    query.leftJoin(relationsSubquery, { 'agg_rels.from_asset_id': 'ast.id' })

    // Site Map subquery
    const siteMapSubquery = knex
      .select(
        'asset_web_id',
        knex.raw('array_agg(json_build_object(\'uri\', uri)) as uris'),
      )
      .from('uri')
      .groupBy('asset_web_id')
      .as('agg_sitemap')
    query.leftJoin(siteMapSubquery, { 'agg_sitemap.asset_web_id': 'ast.id' })
    // Where conditions
    const {
      id,
      ids,
      search,
      severities,
      tagIds,
      groupIds,
      types,
      page,
      pageSize,
      strict = false,
    } = params

    const filterRegex = /(?<keyword>\w+):(?<value>\S*)/g
    const filteredSearch = search?.replace(filterRegex, '').trim()
    // Get the "keyword:value" pair and remove it from the classic search
    /**
     * @type {Array<{keyword: string, value: string}>}
     */
    const filters = [...(search ?? '').matchAll(filterRegex)].map(result => ({
      keyword: result.groups?.keyword.toLowerCase() ?? '',
      value: result.groups?.value.toLowerCase() ?? '',
    }))
    if (id) {
      query.where({ 'ast.id': id })
    }
    else if (ids) {
      query.whereIn('ast.id', ids.split(','))
    }
    else {
      if (filteredSearch) {
        if (!strict) {
          const assetIps = await searchIpModel(
            knex,
            filteredSearch.toLowerCase(),
            companyId,
          )
          const assetIpIds = assetIps.reduce((res: any, ipId: any) => {
            res.push(ipId.ast_id)
            return res
          }, [])
          query.where(function (this: any) {
            this.where(
              knex.raw('LOWER(ast.name)'),
              'like',
              knex.raw('?', `%${filteredSearch.toLowerCase()}%`),
            )
              .orWhere(
                knex.raw('LOWER(asrv.os)'),
                'like',
                knex.raw('?', `%${filteredSearch.toLowerCase()}%`),
              )
              .orWhere(
                knex.raw('LOWER(aweb.url)'),
                'like',
                knex.raw('?', `%${filteredSearch.toLowerCase()}%`),
              )
              .orWhere(
                knex.raw('LOWER(aweb.language)'),
                'like',
                knex.raw('?', `%${filteredSearch.toLowerCase()}%`),
              )
              .orWhere(
                knex.raw('LOWER(abdg.location)'),
                'like',
                knex.raw('?', `%${filteredSearch.toLowerCase()}%`),
              )
              .orWhere('ast.id', 'in', assetIpIds)
          })
        }
        else {
          const assetIps = await searchIpModel(
            knex,
            filteredSearch.toLowerCase(),
            companyId,
            true,
          )
          const assetIpIds = assetIps.reduce((res: any, ipId: any) => {
            res.push(ipId.ast_id)
            return res
          }, [])
          query.where(function (this: any) {
            this.where('ast.name', filteredSearch)
              .orWhere('asrv.os', filteredSearch)
              .orWhere('aweb.url', filteredSearch)
              .orWhere('aweb.language', filteredSearch)
              .orWhere('abdg.location', filteredSearch)
              .orWhere('ast.id', 'in', assetIpIds)
          })
        }
      }
      if (severities) {
        const arrSeverities = severities
          .split(',')
          .map((s: any) => s.toLowerCase())
        const SEVERITIES = {
          critical: 'critical',
          high: 'high',
          low: 'low',
          medium: 'medium',
        }
        query.andWhere((builder: any) => {
          arrSeverities.forEach((sev: any) => {
            if (SEVERITIES[sev])
              builder.orWhere(`agg_sev.${sev}`, '>', 0)
          })
        })
        /* arrSeverities.forEach((sev) => {
          if (SEVERITIES[sev]) {
            query
              .whereNotNull(`agg_sev.${sev}`)
              .andWhere(`agg_sev.${sev}`, '>', 0)
          }
        }) */
      }

      if (!roles.includes('admin')) {
        if (groups)
          groupsSubquery.whereIn('gast.group_id', groups)

        query.andWhere(function (this: any) {
          this.whereNotNull('agg_group.groups')
        })
      }
      if (tagIds) {
        const arrTagIds = tagIds.split(',')
        tagsSubquery.whereIn('atg.asset_id', function (this: any) {
          this.select('asset_id').from('tag_asset').whereIn('tag_id', arrTagIds)
        })
      }

      if (groupIds) {
        const arrGroupIds = groupIds.split(',')
        groupsSubquery.whereIn('gast.asset_id', function (this: any) {
          this.select('asset_id')
            .from('group_asset')
            .whereIn('group_id', arrGroupIds)
        })
      }
    }

    if (types) {
      const arrTypes = types.split(',')
      query.whereIn('ast.type', arrTypes)
    }

    if (
      !isNaN(parseInt(page))
      && !isNaN(parseInt(pageSize))
      && filters.length === 0
      && types !== 'SERVER'
    ) {
      query
        .limit(parseInt(pageSize))
        .offset((parseInt(page) - 1) * parseInt(pageSize))
    }
    const result = await query
    for (const elem of result) {
      if (elem.parents?.length > 0) {
        elem.parents = elem.parents.filter((e: any) => e.id !== null)
        elem.parents = await Promise.all(
          elem.parents.map(async (parent: any) => {
            const [{ name, type }] = await knex
              .select('name', 'type')
              .from('asset')
              .where('id', parent.id)
            return {
              ...parent,
              name,
              type,
            }
          }),
        )
      }
      if (elem.children?.length > 0) {
        elem.children = elem.children.filter((e: any) => e.id !== null)
        elem.children = await Promise.all(
          elem.children.map(async (child: any) => {
            const [{ name, type }] = await knex
              .select('name', 'type')
              .from('asset')
              .where('id', child.id)
            return {
              ...child,
              name,
              type,
            }
          }),
        )
      }
      const risk = await getAssetRiskModel(companyId, elem.id)
      elem.risk = risk
    }
    // Filter result
    let resultsFiltered = result

    // Apply regex filters
    filters.forEach(({ keyword, value }) => {
      switch (keyword) {
        case 'port': // fall-through to 'ports'
        case 'ports':
          resultsFiltered = resultsFiltered.filter((asset: any) => {
            return asset.ports.some((port: any) => {
              return port.number === parseInt(value)
            })
          })
          break
        case 'id':
          resultsFiltered = resultsFiltered.filter(
            (asset: any) => asset.id === parseInt(value),
          )
          break

        default:
          resultsFiltered = resultsFiltered.filter(
            (asset: any) =>
              typeof asset[keyword] === 'string'
              && asset[keyword].toLowerCase().includes(value),
          )
          break
      }
    })

    // Remove duplicates by keeping only one asset by id (like server assets with multiple ips)
    resultsFiltered = resultsFiltered.filter((a, pos, assets) => {
      return assets.map(mapObj => mapObj.id).indexOf(a.id) === pos
    })

    if (Array.isArray(result)) {
      if (id) {
        // Single asset
        const isMultiIpsServer = result.every(asset => asset.type === 'SERVER' && asset.id === Number(id))
        if (result.length === 1 || isMultiIpsServer)
          return { asset: result[0] }

        // Error: non handled "multiple assets" with same ids.
        log
          .withError(new Error(`Multiple assets with the id "${id}" found`))
          .error('searchAssetsModel error')
        return { error: NOT_FOUND }
      }

      const ipToInt = (ip: string) => {
        const ipArr = ip.split('.')
        return parseInt(ipArr[0]) * 256 * 256 * 256 + parseInt(ipArr[1]) * 256 * 256 + parseInt(ipArr[2]) * 256 + parseInt(ipArr[3])
      }

      // Sort server assets by ip in numerical order
      if (types === 'SERVER') {
        resultsFiltered = resultsFiltered.sort((a: Server, b: Server) => {
          if (b.mainIps.length === 0)
            return 1
          if (a.mainIps.length === 0 || ipToInt(a.mainIps[0].address) < ipToInt(b.mainIps[0].address))
            return -1
          if (ipToInt(a.mainIps[0].address) > ipToInt(b.mainIps[0].address))
            return 1
          return 0
        })
      }
      let total_result = resultsFiltered.length
      if (filters.length === 0 && result.length > 0)
        total_result = result[0].total_count

      if (page && ((filters.length > 0) || types === 'SERVER')) {
        const minAssetShow = (page - 1) * parseInt(pageSize)
        const maxAssetShow = minAssetShow + parseInt(pageSize)

        resultsFiltered = resultsFiltered.slice(minAssetShow, maxAssetShow)
      }
      // Multiple assets
      return {
        assets: resultsFiltered,
        total: total_result,
      }
    }

    throw new Error('Unexpected result at search assets')
  }
  catch (error) {
    log.withError(error).error('searchAssetsModel error')
    return { error: MODEL_ERROR }
  }
}

export const searchAssetsBelongingModel = async (
  params: { parents_ids?: string; children_ids?: string },
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId, roles, id: userId } = loggedUserInfo
    const { parents_ids: parentsIds, children_ids: childrenIds } = params
    const groups = await getUserGroupIds(userId)

    let query = knex('v_asset_child')
      .select()
      .where('parent_company_id', companyId)
      .where('child_company_id', companyId)

    if (!roles.includes('admin')) {
      query = query
        .whereIn('parent_group_id', groups)
        .whereIn('child_group_id', groups)
    }

    if (parentsIds?.length && childrenIds?.length) {
      query = query.andWhere((builder: any) =>
        builder
          .whereIn('parent_id', parentsIds.split(','))
          .orWhereIn('child_id', childrenIds.split(',')),
      )
    }
    else if (parentsIds?.length) {
      query = query.whereIn('parent_id', parentsIds.split(','))
    }
    else if (childrenIds?.length) {
      query = query.whereIn('child_id', childrenIds.split(','))
    }

    /**
     * @type {{
     *  parent_id: number,
     *  parent_name: string,
     *  parent_type: string,
     *  child_id: number,
     *  child_name: string,
     *  child_type: string,
     *  company_id: number,
     *  group_id: number
     * }[]}
     */
    const result = await query

    /**
     * @type {{
     *  id: string,
     *  name: string,
     *  type: string,
     *  childrenIds: number[],
     *  parentsIds: number[],
     *  risk?: {}
     * }[]}
     */
    const formattedResults: any = []

    for (const relation of result) {
      const {
        parent_id,
        parent_name,
        parent_type,
        child_id,
        child_name,
        child_type,
      } = relation

      const parent = formattedResults.find(p => p.id === parent_id)

      const child = formattedResults.find(c => c.id === child_id)

      if (!parent) {
        const risk = await getAssetRiskModel(companyId, parent_id)

        formattedResults.push({
          children_ids: [child_id],
          id: parent_id,
          name: parent_name,
          parents_ids: [],
          risk: risk?.error ? null : risk,
          type: parent_type,
        })
      }
      else {
        parent.children_ids.push(child_id)
      }

      if (!child) {
        const risk = await getAssetRiskModel(companyId, child_id)

        formattedResults.push({
          children_ids: [],
          id: child_id,
          name: child_name,
          parents_ids: [parent_id],
          risk: risk?.error ? null : risk,
          type: child_type,
        })
      }
      else {
        child.parents_ids.push(parent_id)
      }
    }

    // Multiple assets
    return {
      assets: formattedResults,
    }
  }
  catch (error) {
    log.withError(error).error('searchAssetsBelongingModel error')
    return { error: MODEL_ERROR }
  }
}

export const createAssetModel = async (params: any, loggedUserInfo: Express.LoggedUser) => {
  try {
    const createdAssetId = await knex.transaction(async (tx) => {
      const { name: inputName, type, assetData = {} } = params
      let name = inputName

      const { companyId, id: userId } = loggedUserInfo

      // Resolving homonyms (appending / increasing a number at the end of the name)

      const nameExtractRegex = `'${inputName} (\\d+)'`
      const nameMatchRegex = `'${inputName}( \\d+)\\?'`

      // The SQL request returns:
      // 0 results if no homonym exists
      // 1 result if a homonym exists with `{index: null}`
      // 1 result if multiple homonyms exist with `{index: largest homonym number}`
      const [highestHomonymIndex] = await knex('asset')
        .select({
          index: knex.raw(`substring(asset.name, ${nameExtractRegex})`),
        })
        .where(knex.raw(`LOWER(name) similar to LOWER(${nameMatchRegex})`))
        .andWhere('asset.company_id', companyId)
        .orderBy('asset.name', 'desc')
        .limit(1)
      if (highestHomonymIndex)
        name = `${inputName} ${parseInt(highestHomonymIndex.index ?? 1) + 1}`

      // Then create the asset
      // Adding empty arrays in case they are not present in the params
      assetData.parents ??= []
      assetData.children ??= []

      const [assetId] = (
        await tx('asset').returning('id').insert({
          company_id: companyId,
          name,
          owner: userId,
          type,
        })
      ).map((e: any) => e.id)

      /**
       * @type {{
       *  children: {
       *    id: number,
       *    name: string,
       *    type: string,
       *  }[],
       *  parents: {
       *    id: number,
       *    name: string,
       *    type: string,
       *  }[]
       * }}
       */
      const relations = {
        children: await knex
          .select('id', 'name', 'type')
          .from('asset')
          .whereIn('id', assetData.children),
        parents: await knex
          .select('id', 'name', 'type')
          .from('asset')
          .whereIn('id', assetData.parents),
      }

      /**
       * @type {{
       *  children: {[relativeId: number]: number},
       *  parents: {[relativeId: number]: number}
       * }}
       */
      const addedRelations = {
        children: {},
        parents: {},
      }

      for (const child of relations.children) {
        const [{ id: relationId }] = await tx('relation')
          .insert({
            from_asset_id: child.id,
            to_asset_id: assetId,
            type: 'BELONGS_TO',
          })
          .returning('id')

        addedRelations.children[child.id] = relationId
      }

      for (const parent of relations.parents) {
        const [{ id: relationId }] = await tx('relation')
          .insert({
            from_asset_id: assetId,
            to_asset_id: parent.id,
            type: 'BELONGS_TO',
          })
          .returning('id')

        addedRelations.parents[parent.id] = relationId
      }

      if (type === 'UNIT') {
        const parentsMissions = relations.parents.filter(
          (parent: any) => parent.type === 'MISSION',
        )
        if (parentsMissions.length > 0) {
          const listOfFearedEvents = await knex
            .select('id')
            .from('feared_event')
          for (const mission of parentsMissions) {
            const missionUnitRelationId = addedRelations.parents[mission.id]
            for (const fearedEvent of listOfFearedEvents) {
              await tx('business_mission_unit_has_feared_event').insert({
                business_mission_unit_id: missionUnitRelationId,
                feared_event_id: fearedEvent.id,
              })
            }
          }
        }
      }
      if (type === 'USER') {
        // Specific actions when creating a USER type asset
      }
      if (type === 'MISSION') {
        const childrenUnits = relations.children.filter(
          (child: any) => child.type === 'UNIT',
        )
        await tx('asset_mission').insert({
          id: assetId,
          last_update_date: new Date(),
          version: 1,
        })
        if (childrenUnits.length > 0) {
          const listOfFearedEvents = await knex
            .select('id')
            .from('feared_event')
          for (const unit of childrenUnits) {
            const missionUnitRelationId = addedRelations.children[unit.id]
            for (const fearedEvent of listOfFearedEvents) {
              await tx('business_mission_unit_has_feared_event').insert({
                business_mission_unit_id: missionUnitRelationId,
                feared_event_id: fearedEvent.id,
              })
            }
          }
        }
      }
      if (type === 'USERGROUP') {
        // Specific actions when creating a USER type asset
      }
      if (type === 'SERVER') {
        const { os = '', hostname = '', IPs = [], ports = {} } = assetData
        await tx('asset_server').insert({
          hostname,
          id: assetId,
          os,
        })
        let isMain = true
        for (let i = 0; i < IPs.length; i++) {
          const ipId = await createIpModel(tx, assetId, { ips: IPs[i], is_main: isMain })
          params.assetData.IPs[i].id = ipId
          for (const port in ports) {
            const portId = await createPortModel(tx, ipId, ports[port])
            params.assetData.ports[port].id = portId
            for (const cipher in ports[port].ciphers)
              await createCipherModel(tx, portId, cipher)
          }
          isMain = false
        }
        // Create WEB asset
      }
      else if (type === 'WEB') {
        const { url = '', language = '' } = assetData
        await tx('asset_web').insert({
          id: assetId,
          language,
          url,
        })
        // Create USER
      }
      else if (type === 'USER') {
        const { position = '', mail = '', tel = '' } = assetData
        await tx('asset_user').insert({
          id: assetId,
          mail,
          position,
          tel,
        })
      }
      else if (type === 'BUILDING') {
        const {
          location = '',
          latitude = '',
          longitude = '',
          postal_address = '',
          phone_number = '',
        } = assetData
        await tx('asset_building').insert({
          id: assetId,
          latitude,
          location,
          longitude,
          phone_number,
          postal_address,
        })
      }
      else if (type === 'POLICY' || type === 'PROCEDURE') {
        const { doc, revision, cdate } = assetData
        await tx('asset_document').insert({ id: assetId, type })
        await tx('revision').insert({
          asset_document_id: assetId,
          cdate,
          revision,
          store_id: doc,
        })
      }
      else if (type === 'NETWORK') {
        const { netmask = null, gateway = null, network = null } = assetData
        await tx('asset_network').insert({
          gateway,
          id: assetId,
          netmask,
          network,
        })
      }
      else if (type === 'COMPLIANCE') {
        const {
          compliance_id,
          status = null,
          mitigation = null,
          residual_risk = null,
        } = assetData
        await tx('asset_compliance').insert({
          compliance_id,
          id: assetId,
          mitigation,
          residual_risk,
          status,
        })
      }
      if (assetData?.cpes) {
        for (const cpe in assetData.cpes) {
          const cpeId = await createCpeModel(tx, cpe)
          await tx('cpe_asset').insert({
            asset_id: assetId,
            cpe_id: cpeId,
          })
        }
      }

      if (assetData?.LOCATED_TO) {
        await tx('relation').insert({
          from_asset_id: assetId,
          to_asset_id: assetData.LOCATED_TO,
          type: 'LOCATED_TO',
        })
      }
      return assetId
    })

    return { id: createdAssetId }
  }
  catch (error) {
    log.withError(error).error('createAssetModel error')
    return { error }
  }
}

export const deleteAssetModel = async (id: any, loggedUserInfo: Express.LoggedUser) => {
  try {
    if (!id)
      return { error: VALIDATION_ERROR }

    const { companyId } = loggedUserInfo
    const [assetToDelete] = await knex.select().from({ ast: 'asset' }).where({
      'ast.company_id': companyId,
      'ast.id': id,
    })
    if (!assetToDelete)
      return { error: NOT_FOUND }

    await knex('asset').where('id', id).delete()

    return { status: SUCCESS }
  }
  catch (error) {
    log.withError(error).error('deleteAssetModel error')
    return { error: MODEL_ERROR }
  }
}

/**
 * Updates an asset and its related tables accordingly
 *
 * @param {number} id ID of asset to update
 * @param {object} params New fields of asset once updated
 * @param {string} params.name New name of asset
 * @param {string} params.os New OS of asset
 * @param {string} params.ip New IP address of asset
 * @param {number[]} params.tagIds Tags linked to asset
 * @param {number} params.groupId Group linked to the asset
 * @returns {Promise<{ error?: string, status?: string }>} Whether if the update was successful or not
 */
export const updateAssetModel = async (
  id: any,
  params: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    if (!id)
      return { error: VALIDATION_ERROR }
    if (!params || !Object.entries(params).length)
      return { status: SUCCESS } // nothing to update

    const { error, status } = await knex.transaction(async (tx: any) => {
      const { name, assetData = {}, tagIds, groupIds, x, y } = params
      // Verify if asset exist

      const { companyId } = loggedUserInfo
      const [assetExist] = await tx
        .select()
        .from({ ast: 'asset' })
        // .leftJoin('asset_server as asrv', 'asrv.id', 'ast.id')
        // .leftJoin('asset_web as aweb', 'aweb.id', 'ast.id')
        // .leftJoin('asset_user as ausr', 'ausr.id', 'ast.id')
        // .leftJoin('asset_building as ablg', 'ablg.id', 'ast.id')
        .where({
          'ast.company_id': companyId,
          'ast.id': id,
        })
      if (!assetExist)
        return { error: NOT_FOUND }

      // Check for homonyms
      const assetWithSameName = await knex('asset')
        .where('name', 'like', `${name}`)
        .andWhere('type', 'like', `${assetExist.type}`)
        .andWhereNot({ id })
      if (assetWithSameName.length !== 0)
        throwDuplicateError()

      const updates = []

      const relations = {
        children: await knex
          .select('child_id')
          .from('v_asset_child')
          .where('v_asset_child.parent_id', assetExist.id)
          .pluck('child_id'),
        parents: await knex
          .select('parent_id')
          .from('v_asset_child')
          .where('v_asset_child.child_id', assetExist.id)
          .pluck('parent_id'),
      }

      // populating arrays in case they are not present in the params
      assetData.parents ??= relations.parents.slice()
      assetData.children ??= relations.children.slice()

      const deletedChildren = relations.children.filter((childId: any) => {
        return !assetData.children.includes(childId)
      })
      const addedChildren = assetData.children.filter((childId: any) => {
        return !relations.children.includes(childId)
      })
      const deletedParents = relations.parents.filter((parentId: any) => {
        return !assetData.parents.includes(parentId)
      })
      const addedParents = assetData.parents.filter((parentId: any) => {
        return !relations.parents.includes(parentId)
      })

      const newRelationIds = {
        /**
         * @type {number[]}
         */
        children: [],
        /**
         * @type {number[]}
         */
        parents: [],
      }

      if (deletedChildren.length) {
        updates.push(
          knex
            .delete()
            .from('relation')
            .where({
              'relation.to_asset_id': id,
              'relation.type': 'BELONGS_TO',
            })
            .and.whereIn('relation.from_asset_id', deletedChildren)
            .returning('id'),
        )
      }
      await Promise.all(
        addedChildren.map(async (childId: any) => {
          const [{ id: relationId }] = await tx('relation')
            .insert({
              from_asset_id: childId,
              to_asset_id: id,
              type: 'BELONGS_TO',
            })
            .returning('id')

          newRelationIds.children.push(relationId)
        }),
      )

      if (deletedParents.length) {
        updates.push(
          knex
            .delete()
            .from('relation')
            .where({
              'relation.from_asset_id': id,
              'relation.type': 'BELONGS_TO',
            })
            .and.whereIn('relation.to_asset_id', deletedParents)
            .returning('id'),
        )
      }
      await Promise.all(
        addedParents.map(async (parentId: any) => {
          const [{ id: relationId }] = await tx('relation')
            .insert({
              from_asset_id: id,
              to_asset_id: parentId,
              type: 'BELONGS_TO',
            })
            .returning('id')

          newRelationIds.parents.push(relationId)
        }),
      )

      if ([name].some(item => item !== undefined))
        updates.push(tx('asset').where('id', id).update({ name }))

      if ([x, y].some(item => item !== undefined))
        updates.push(tx('asset').where('id', id).update({ x, y }))

      if (assetExist.type === 'SERVER') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_server as asrv')
          .where('asrv.id', id)
        const {
          os = assetToUpdate.os,
          hostname = assetToUpdate.hostname,
          IPs = [],
          ports = {},
        } = assetData
        updates.push(
          tx('asset_server').where('id', id).update({ hostname, os }),
        )
        for (let i = 0; i < IPs.length; i++) {
          const ipId = await updateOrCreateIpModel(tx, id, IPs[i])
          params.assetData.IPs[i].id = ipId
          for (const port in ports) {
            tx('port').update({ status: 'closed' }).where('port.ip_id', ipId)
            const portId = await updateOrCreatePortModel(tx, ipId, ports[port])
            params.assetData.ports[port].id = portId
            const { ciphers = [] } = ports[port]
            for (const cipher in ciphers) {
              tx('cipher_suite').delete().where('cipher_suite.port_id', portId)
              await createCipherModel(tx, portId, cipher)
            }
          }
        }
      }
      else if (assetExist.type === 'UNIT') {
        if (newRelationIds.parents.length > 0) {
          const listOfFearedEvents = await knex
            .select('id')
            .from('feared_event')
          for (const missionUnitRelationId of newRelationIds.parents) {
            for (const fearedEvent of listOfFearedEvents) {
              updates.push(
                tx('business_mission_unit_has_feared_event').insert({
                  business_mission_unit_id: missionUnitRelationId,
                  feared_event_id: fearedEvent.id,
                }),
              )
            }
          }
        }
      }
      else if (assetExist.type === 'USERGROUP') {
        // REMOVED
      }
      else if (assetExist.type === 'MISSION') {
        if (newRelationIds.children.length > 0) {
          const listOfFearedEvents = await knex
            .select('id')
            .from('feared_event')
          for (const unitMissionRelationId of newRelationIds.children) {
            for (const fearedEvent of listOfFearedEvents) {
              updates.push(
                tx('business_mission_unit_has_feared_event').insert({
                  business_mission_unit_id: unitMissionRelationId,
                  feared_event_id: fearedEvent.id,
                }),
              )
            }
          }
        }
      }
      else if (assetExist.type === 'USER') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_user as asrv')
          .where('asrv.id', id)
        updates.push(
          tx('asset_user')
            .where('id', id)
            .update({
              mail: assetData?.mail || assetToUpdate.mail,
              position: assetData?.position || assetToUpdate.position,
              tel: assetData?.tel || assetToUpdate.tel,
            }),
        )
      }
      else if (assetExist.type === 'WEB') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_web as asrv')
          .where('asrv.id', id)
        updates.push(
          tx('asset_web')
            .where('id', id)
            .update({
              language: assetData?.language || assetToUpdate.language,
              url: assetData?.url || assetToUpdate.url,
            }),
        )
      }
      else if (
        assetExist.type === 'POLICY'
        || assetExist.type === 'PROCEDURE'
      ) {
        const [assetToUpdate] = await tx
          .select()
          .from('revision')
          .where('asset_document_id', id)
        updates.push(
          tx('revision')
            .where('asset_document_id', id)
            .update({
              cdate: assetData?.rev_cdate || assetToUpdate.rev_cdate,
              revision: assetData?.revision || assetToUpdate.revision,
            }),
        )
      }
      else if (assetExist.type === 'BUILDING') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_building as asrv')
          .where('asrv.id', id)
        updates.push(
          tx('asset_building')
            .where('id', id)
            .update({
              latitude: assetData?.latitude || assetToUpdate.latitude,
              location: assetData?.location || assetToUpdate.location,
              longitude: assetData?.longitude || assetToUpdate.longitude,
              phone_number:
                assetData?.phone_number || assetToUpdate.phone_number,
              postal_address:
                assetData?.postal_address || assetToUpdate.postal_address,
            }),
        )
      }
      else if (assetExist.type === 'NETWORK') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_network as asrv')
          .where('asrv.id', id)
        updates.push(
          tx('asset_network')
            .where('id', id)
            .update({
              gateway: assetData.gateway || assetToUpdate.gateway,
              netmask: assetData.netmask || assetToUpdate.netmask,
              network: assetData.network || assetToUpdate.network,
            }),
        )
      }
      else if (assetExist.type === 'COMPLIANCE') {
        const [assetToUpdate] = await tx
          .select()
          .from('asset_compliance as acle')
          .where('acle.id', id)
        updates.push(
          tx('asset_compliance')
            .where('id', id)
            .update({
              mitigation: assetData?.mitigation || assetToUpdate?.mitigation,
              residual_risk:
                assetData?.residual_risk || assetToUpdate.residual_risk,
              status: assetData?.status || assetToUpdate.status,
            }),
        )
      }
      if (assetData?.cpes) {
        for (const cpe in assetData.cpes) {
          const cpeId = await updateOrCreateCpeModel(
            tx,
            { assetId: id },
            assetData.cpes[cpe],
          )
          const [cpeAssetExist] = await knex
            .select()
            .from('cpe_asset as cast')
            .where({ 'cast.asset_id': id, 'cast.cpe_id': cpeId })
          if (!cpeAssetExist) {
            await tx('cpe_asset').insert({
              asset_id: id,
              cpe_id: cpeId,
            })
          }
        }
      }

      if (assetData?.OWN_BY) {
        const owners = await knex.select().from('relation').where({
          from_asset_id: id,
          type: 'OWN_BY',
        })
        for (let i = 0; i < assetData.OWN_BY.length; i++) {
          const idToDel = owners.findIndex(
            (item: any) => item.to_asset_id === assetData.OWN_BY[i],
          )

          idToDel === -1
            ? updates.push(
              tx('relation').insert({
                from_asset_id: id,
                to_asset_id: assetData.OWN_BY[i],
                type: 'OWN_BY',
              }),
            )
            : owners.splice(idToDel, 1)
        }
        owners.forEach((elt: any) =>
          updates.push(knex.delete().from('relation').where({ id: elt.id })),
        )
      }
      if (assetData?.MAINTAINED_BY) {
        const maintainer = await knex.select().from('relation').where({
          from_asset_id: id,
          type: 'MAINTAINED_BY',
        })
        for (let i = 0; i < assetData.MAINTAINED_BY.length; i++) {
          const idToDel = maintainer.findIndex(
            (item: any) => item.to_asset_id === assetData.MAINTAINED_BY[i],
          )

          idToDel === -1
            ? updates.push(
              tx('relation').insert({
                from_asset_id: id,
                to_asset_id: assetData.MAINTAINED_BY[i],
                type: 'MAINTAINED_BY',
              }),
            )
            : maintainer.splice(idToDel, 1)
        }
        maintainer.forEach((elt: any) =>
          updates.push(knex.delete().from('relation').where({ id: elt.id })),
        )
      }
      if (assetData?.REVIEWED_BY) {
        const maintainer = await knex.select().from('relation').where({
          from_asset_id: id,
          type: 'REVIEWED_BY',
        })
        for (let i = 0; i < assetData.REVIEWED_BY.length; i++) {
          const idToDel = maintainer.findIndex(
            (item: any) => item.to_asset_id === assetData.REVIEWED_BY[i],
          )

          idToDel === -1
            ? updates.push(
              tx('relation').insert({
                from_asset_id: id,
                to_asset_id: assetData.REVIEWED_BY[i],
                type: 'REVIEWED_BY',
              }),
            )
            : maintainer.splice(idToDel, 1)
        }
        maintainer.forEach((elt: any) =>
          updates.push(knex.delete().from('relation').where({ id: elt.id })),
        )
      }
      if (assetData?.APPROVED_BY) {
        const maintainer = await knex.select().from('relation').where({
          from_asset_id: id,
          type: 'APPROVED_BY',
        })
        for (let i = 0; i < assetData.APPROVED_BY.length; i++) {
          const idToDel = maintainer.findIndex(
            (item: any) => item.to_asset_id === assetData.APPROVED_BY[i],
          )

          idToDel === -1
            ? updates.push(
              tx('relation').insert({
                from_asset_id: id,
                to_asset_id: assetData.APPROVED_BY[i],
                type: 'APPROVED_BY',
              }),
            )
            : maintainer.splice(idToDel, 1)
        }
        maintainer.forEach((elt: any) =>
          updates.push(knex.delete().from('relation').where({ id: elt.id })),
        )
      }
      if (assetData?.REFERRED_TO) {
        const maintainer = await knex.select().from('relation').where({
          from_asset_id: id,
          type: 'REFERRED_TO',
        })
        for (let i = 0; i < assetData.REFERRED_TO.length; i++) {
          const idToDel = maintainer.findIndex(
            (item: any) => item.to_asset_id === assetData.REFERRED_TO[i],
          )

          idToDel === -1
            ? updates.push(
              tx('relation').insert({
                from_asset_id: id,
                to_asset_id: assetData.REFERRED_TO[i],
                type: 'REFERRED_TO',
              }),
            )
            : maintainer.splice(idToDel, 1)
        }
        maintainer.forEach((elt: any) =>
          updates.push(knex.delete().from('relation').where({ id: elt.id })),
        )
      }
      if (assetData?.LOCATED_TO) {
        const [isLocationExist] = await knex.select().from('relation').where({
          from_asset_id: id,
          to_asset_id: assetData.LOCATED_TO,
          type: 'LOCATED_TO',
        })
        if (!isLocationExist) {
          await knex
            .delete()
            .from('relation')
            .where({ from_asset_id: id, type: 'LOCATED_TO' })
          updates.push(
            await tx('relation').insert({
              from_asset_id: id,
              to_asset_id: assetData.LOCATED_TO,
              type: 'LOCATED_TO',
            }),
          )
        }
      }

      if (Array.isArray(tagIds)) {
        await tx('tag_asset').where('asset_id', id).del()

        if (tagIds.length) {
          updates.push(
            tx('tag_asset').insert(
              tagIds.map(tagId => ({ asset_id: id, tag_id: tagId })),
            ),
          )
        }
      }

      if (Array.isArray(groupIds)) {
        await tx('group_asset').where('asset_id', id).del()

        if (groupIds.length) {
          updates.push(
            tx('group_asset').insert(
              groupIds.map(groupId => ({ asset_id: id, group_id: groupId })),
            ),
          )
        }
      }

      await Promise.all(updates)
      return { status: SUCCESS }
    })

    return error ? { error } : { status }
  }
  catch (error) {
    log.withError(error).error('updateAssetError error')
    return { error: error ?? MODEL_ERROR }
  }
}

/**
 *
 * @param {number} assetId ID of the asset to which this vulnerabilities belong to
 * @param {object} params Search params
 * @param {string} params.search Search string to search vulnerabilities by name
 *                                   Filters vulnerabilities by severity level.
 * @returns {Promise<{ error: string } | {
 *  vulnerabilities: object[],
 *  total: number
 * }>} List of vulnerabilities if successful. Error if failed.
 */
export const searchAssetRevisions = async (
  assetId: any,
  params: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo
    const query = knex
      .select({
        asset_document_id: 'rev.asset_document_id',
        cdate: 'rev.cdate',
        id: 'rev.id',
        md5: 'store.md5',
        name: 'store.name',
        revision: 'rev.revision',
        size: 'store.size',
        store_id: 'rev.store_id',
        type: 'store.type',
        udate: 'store.udate',
      })
      .from({ rev: 'revision' })
      .innerJoin({ ast: 'asset' }, { 'ast.id': 'rev.asset_document_id' })
      .innerJoin({ cp: 'company' }, { 'cp.id': 'ast.company_id' })
      .innerJoin('store as store', 'store.id', 'rev.store_id')
      .where('cp.id', companyId)
      .andWhere('ast.id', assetId)
      .orderBy('rev.revision')

    // Search params
    const { search } = params
    if (search) {
      query.where(
        knex.raw('LOWER(rev.revision) LIKE ?', `%${search.toLowerCase()}%`),
      )
    }

    const result = await query
    if (Array.isArray(result)) {
      return {
        revisions: result,
        total: result.length,
      }
    }

    return { error: MODEL_ERROR }
  }
  catch (error) {
    log.withError(error).error('searchAssetRevisions error')
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns {Promise<{ error: string } | {
 *  summary: {
 *   [assetType: string]: number,
 *   technicalAssets: number
 *   superAssets: number
 *  }
 * }>}
 */
export const getAssetsSummary = async (loggedUserInfo: any) => {
  try {
    const { companyId } = loggedUserInfo

    if (!companyId)
      return { error: 'Invalid company ID' }

    const countsResult = await prismaClient.asset.groupBy({
      _count: true,
      by: ['type'],
      where: {
        company_id: companyId,
      },
    })

    const counts = Object.fromEntries(
      countsResult.map((count: any) => [count.type, count._count]),
    )

    return {
      summary: {
        ...counts,
        superAssets: Object.keys(counts)
          .filter(assetType => SUPER_ASSET_TYPES.includes(assetType))
          .reduce((acc, assetType) => acc + counts[assetType], 0),
        technicalAssets: Object.keys(counts)
          .filter(assetType => TECHNICAL_ASSET_TYPES.includes(assetType))
          .reduce((acc, assetType) => acc + counts[assetType], 0),
      },
    }
  }
  catch (error) {
    log.withError(error).error('getAssetsSummary error')
    return { error: MODEL_ERROR }
  }
}

export const searchAssetVulnerabilityModel = async (
  assetId: any,
  vulnId: any,
  params: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo
    const { ipId, portId, uriId } = params

    const query = knex
      .select('vast.id as id')
      .from('vulnerability_asset as vast')
      .innerJoin('asset as ast', 'ast.id', 'vast.asset_id')
      .where({
        'ast.company_id': companyId,
        'vast.asset_id': assetId,
      })
    if (vulnId)
      query.andWhere('vast.vulnerability_id', vulnId)
    if (ipId)
      query.andWhere('vast.ip_id', ipId)
    if (portId)
      query.andWhere('vast.port_id', portId)
    if (uriId)
      query.andWhere('vast.uri_id', uriId)
    const assetVuln = await query
    return assetVuln.length === 1 ? assetVuln[0].id : assetVuln
  }
  catch (error) {
    log.withError(error).error('searchAssetVulnerabilityModel error')
    return { error: MODEL_ERROR }
  }
}

export const createAssetVulnerabilityModel = async (
  assetId: any,
  vulnId: any,
  params: any,
) => {
  try {
    const {
      cpe_id = knex.raw('NULL'),
      ip_id = knex.raw('NULL'),
      port_id = knex.raw('NULL'),
      uri_id = knex.raw('NULL'),
      code,
      score,
      version,
      severity = knex.raw('NULL'),
      confidence = knex.raw('NULL'),
      likelihood = knex.raw('NULL'),
      details = knex.raw('NULL'),
      exploit_code_maturity = knex.raw('NULL'),
      exploitability_ease = knex.raw('NULL'),
      patch_publication_date = knex.raw('NULL'),
      plugin_modification_date = knex.raw('NULL'),
      vuln_publication_date = knex.raw('NULL'),
      exploit_available = false,
      exploit_framework_core = false,
      exploited_by_malware = false,
      status = 'open',
      custom_description = null,
      custom_remediation = null,
    } = params

    const astVulnId = await knex.transaction(async (tx: any) => {
      const cvssId = await createCvssModel(tx, { code, score, version })
      const id = (
        await tx('vulnerability_asset').returning('id').insert({
          asset_id: assetId,
          confidence,
          cpe_id,
          custom_description,
          custom_remediation,
          cvss_id: cvssId,
          details,
          exploit_available,
          exploit_code_maturity,
          exploit_framework_core,
          exploitability_ease,
          exploited_by_malware,
          ip_id,
          likelihood,
          patch_publication_date,
          plugin_modification_date,
          port_id,
          severity,
          status,
          uri_id,
          vuln_publication_date,
          vulnerability_id: vulnId,
        })
      ).map((e: any) => e.id)
      return id
    })
    return astVulnId
  }
  catch (error) {
    log.withError(error).error('createAssetVulnerabilityModel error')
    return { error: MODEL_ERROR }
  }
}

export const updateAssetVulnerabilityModel = async (
  astVulnId: any,
  params: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo

    const [astVulnToUpdate] = await knex
      .select()
      .from('vulnerability_asset as vast')
      .leftJoin('cvss', 'cvss.id', 'vast.cvss_id')
      .innerJoin('asset as ast', 'ast.id', 'vast.asset_id')
      .where({ 'ast.company_id': companyId, 'vast.id': astVulnId })
    if (!astVulnToUpdate)
      return { error: MODEL_ERROR }
    const {
      cvss_id = astVulnToUpdate.cvss_id,
      score = astVulnToUpdate.score,
      version = astVulnToUpdate.version,
      code = astVulnToUpdate.code,
      cpe_id = astVulnToUpdate.cpe_id,
      ip_id = astVulnToUpdate.ip_id,
      port_id = astVulnToUpdate.port_id,
      uri_id = astVulnToUpdate.uri_id,
      severity = astVulnToUpdate.severity,
      confidence = astVulnToUpdate.confidence,
      likelihood = astVulnToUpdate.likelihood,
      details = astVulnToUpdate.details,
      exploit_code_maturity = astVulnToUpdate.exploit_code_maturity,
      exploitability_ease = astVulnToUpdate.exploitability_ease,
      patch_publication_date = astVulnToUpdate.patch_publication_date,
      plugin_modification_date = astVulnToUpdate.plugin_modification_date,
      vuln_publication_date = astVulnToUpdate.vuln_publication_date,
      exploit_available = astVulnToUpdate.exploit_available,
      exploit_framework_core = astVulnToUpdate.exploit_framework_core,
      exploited_by_malware = astVulnToUpdate.exploited_by_malware,
      status = astVulnToUpdate.status,
      statusComment = '',
    } = params
    await knex.transaction(async (tx: any) => {
      await updateCvssModel(tx, cvss_id, { code, score, version })
      await tx('vulnerability_asset').where('id', astVulnId).update({
        confidence,
        cpe_id,
        cvss_id,
        details,
        exploit_available,
        exploit_code_maturity,
        exploit_framework_core,
        exploitability_ease,
        exploited_by_malware,
        ip_id,
        likelihood,
        patch_publication_date,
        plugin_modification_date,
        port_id,
        severity,
        status,
        uri_id,
        vuln_publication_date,
      })
    })
    if (status !== astVulnToUpdate.status) {
      await updateStatusModel(
        astVulnToUpdate.asset_id,
        astVulnToUpdate.vulnerability_id,
        { comment: statusComment, updated: status },
        loggedUserInfo,
      )
    }
    return { status: SUCCESS }
  }
  catch (error) {
    log.withError(error).error('updateAssetVulnerabilityModel error')
    return { error: MODEL_ERROR }
  }
}

export const fetchAssetPortsModel = async (
  assetId: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo
    const res = []
    const ips = await searchIpModel(knex, undefined, companyId, false, assetId)
    for (const idx in ips) {
      const ports = await searchPortModel(knex, {
        companyId,
        ipId: ips[idx].ip_id,
      })
      if (ports.length === 0)
        res.push({ ...ips[idx] })
      for (const pidx in ports) res.push({ ...ips[idx], ...ports[pidx] })
    }
    return { details: res }
  }
  catch (error) {
    log.withError(error).error('fetchAssetPortsModel error')
    return { error: MODEL_ERROR }
  }
}

export const createIpPortsModel = async (assetId: any, params: any) => {
  try {
    const { ip_id = null, ports = [] } = params
    await knex.transaction(async (tx: any) => {
      if (!ip_id)
        params.ip_id = await createIpModel(tx, assetId, params)

      for (const idx in ports) {
        if (!ports[idx].id) {
          params.ports[idx].id = await createPortModel(
            tx,
            params.ip_id,
            params.ports[idx],
          )
        }
      }
    })
    return true
  }
  catch (error) {
    log.withError(error).error('createIpPortsModel error')
    return { error: MODEL_ERROR }
  }
}

export const createUrisModel = async (
  assetId: any,
  params: any,
  loggedUserInfo: Express.LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo
    const { address } = params
    const uri_id = await knex.transaction(async (tx: any) => {
      const [uri_id] = await searchUriModel(
        tx,
        address,
        companyId,
        true,
        assetId,
      )
      if (!uri_id) {
        const uri_id = await createUriModel(tx, assetId, params)
        return uri_id
      }
      else {
        return uri_id.uri_id
      }
    })
    return uri_id
  }
  catch (error) {
    log.withError(error).error('createUrisModel error')
    return { error: MODEL_ERROR }
  }
}

/*
export const createAssetVulnerabilityModel = async (
  assetId,
  params,
  loggedUserInfo: Express.LoggedUser
) => {
  try {
    const { companyId } = loggedUserInfo
    const {
      name = null,
      description = null,
      remediation = null,
      details = null,
      code = null,
      score = null,
      ips = [],
    } = params
    const [asset] = await knex
      .select()
      .from('asset as ast')
      .where({ 'ast.company_id': companyId, 'ast.id': assetId })
    if (!asset) return { error: NOT_FOUND }

    let vulnerability_id = params.vulnerability_id
    let newVuln = false
    if (!vulnerability_id) {
      newVuln = true
      vulnerability_id = await knex.transaction(async (tx) => {
        const id = await tx('vulnerability')
          .returning('id')
          .insert({ description, remediation, name })
        return id
      })
    }
    let cvss_id = null
    if (code && score) {
      cvss_id = await knex.transaction(async (tx) => {
        const id = await tx('cvss').returning('id').insert({ code, score })
        return id
      })
    }
    if (ips.length === 0) {
      await knex.transaction(async (tx) => {
        await tx('vulnerability_asset').insert({
          asset_id: assetId,
          vulnerability_id,
          details,
          cvss_id,
          description: newVuln ? null : description,
          remediation: newVuln ? null : remediation,
        })
      })
    } else {
      for (let idx = 0; idx < ips.length; idx++) {
        if (!ips[idx].ip_id) {
          ips[idx].ip_id = await knex.transaction(async (tx) => {
            const id = await tx('ip')
              .returning('id')
              .insert({ asset_server_id: assetId, address: ips[idx].address })
            return id
          })
        }
        for (let pidx = 0; pidx < ips[idx].ports.length; pidx++) {
          if (!ips[idx].ports[pidx].id) {
            ips[idx].ports[pidx].id = await knex.transaction(async (tx) => {
              const id = await tx('port').returning('id').insert({
                ip_id: ips[idx].ip_id,
                number: ips[idx].ports[pidx].number,
              })
              return id
            })
          }
          await knex.transaction(async (tx) => {
            await tx('vulnerability_asset').insert({
              asset_id: assetId,
              vulnerability_id,
              details,
              cvss_id,
              ip_id: ips[idx].ip_id,
              port_id: ips[idx].ports[pidx].id,
              description: newVuln ? null : description,
              remediation: newVuln ? null : remediation,
            })
          })
        }
        if (ips[idx].ports.length === 0) {
          await knex.transaction(async (tx) => {
            await tx('vulnerability_asset').insert({
              asset_id: assetId,
              vulnerability_id,
              details,
              cvss_id,
              ip_id: ips[idx].ip_id,
              description: newVuln ? null : description,
              remediation: newVuln ? null : remediation,
            })
          })
        }
      }
    }
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
*/
