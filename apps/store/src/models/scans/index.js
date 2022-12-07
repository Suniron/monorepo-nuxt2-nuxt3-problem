// @ts-check
import { MODEL_ERROR, SUCCESS } from '@/common/constants'
import { format } from 'date-fns'
import prismaClient from '@/prismaClient'
import { getUserGroupIds } from '@/utils/user.utils'
import { log } from '@/lib/logger'

/**
 * Returns scans
 *
 * @param {object} provider
 * @param {object} params
 * @param {string} params.page Number of the page to get
 * @param {string} params.pageSize Number of scans returned by page
 * @param {object} loggedUserInfo
 * @returns {Promise<{ error?: string, scans?: Object, total?: number }>} scans: Data of the scans, total: number of scans
 */
export const searchScansModel = async (
  provider,
  params,
  loggedUserInfo = {}
) => {
  const { companyId } = loggedUserInfo
  const { pageSize, page } = params
  try {
    const take = parseInt(pageSize) ? parseInt(pageSize) : 10
    const skip = parseInt(page) ? (parseInt(page) - 1) * take : 0
    const totalScan = await prismaClient.scan.count({
      where: { company_id: companyId },
    })
    const scans = await prismaClient.scan
      .findMany({
        select: {
          id: true,
          name: true,
          cdate: true,
          sdate: true,
          fdate: true,
          start_date: true,
          end_date: true,
          start_time: true,
          end_time: true,
          status: true,
          probe: {
            select: {
              name: true,
            },
          },
          v_scan_severity_count: {
            select: {
              info: true,
              low: true,
              medium: true,
              high: true,
              critical: true,
            },
          },
          v_scan_asset_details: {
            select: {
              asset_id: true,
              name: true,
              os: true,
              hostname: true,
              ip_address: true,
              language: true,
              url: true,
              mail: true,
            },
            orderBy: {
              lower_name: 'asc',
            },
          },
        },
        where: {
          company_id: companyId,
        },
        orderBy: {
          cdate: 'desc',
        },
        take: take,
        skip: skip,
      })
      .then((scans) =>
        scans.map((scan) => {
          const { probe, v_scan_severity_count, v_scan_asset_details } = scan
          return {
            id: scan.id,
            name: scan.name,
            cdate: scan.cdate,
            sdate: scan.sdate,
            fdate: scan.fdate,
            startDate: scan.start_date
              ? format(new Date(scan.start_date), 'yyyy-MM-dd')
              : null,
            endDate: scan.end_date
              ? format(new Date(scan.end_date), 'yyyy-MM-dd')
              : null,
            startTime: scan.start_time
              ? format(new Date(scan.start_time), 'HH:mm:ss')
              : null,
            endTime: scan.end_time
              ? format(new Date(scan.end_time), 'HH:mm:ss')
              : null,
            status: scan.status,
            probeName: probe?.name,
            info: v_scan_severity_count[0]?.info,
            low: v_scan_severity_count[0]?.low,
            medium: v_scan_severity_count[0]?.medium,
            high: v_scan_severity_count[0]?.high,
            crit: v_scan_severity_count[0]?.critical,
            assets: v_scan_asset_details.map((asset) => {
              return {
                id: asset.asset_id,
                name: asset.name,
                os: asset.os,
                hostname: asset.hostname,
                ips: asset.ip_address,
                language: asset.language,
                url: asset.url,
                mail: asset.mail,
              }
            }),
          }
        })
      )

    if (Array.isArray(scans)) {
      return {
        scans: scans,
        total: totalScan,
      }
    }

    return { error: MODEL_ERROR }
  } catch (error) {
    log.withError(error).error('searchScansModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Returns a scan by its ID
 *
 * @param {object} provider
 * @param {object} params
 * @param {number} params.scanId Id of the scan to get
 * @param {object} loggedUserInfo
 * @returns {Promise<{ error?: string, scan?: Object }>} scan: Data of the scan
 */
export const getScanModel = async (provider, params, loggedUserInfo = {}) => {
  const { knex } = provider
  const { companyId } = loggedUserInfo
  const { scanId } = params
  try {
    const scan = await knex
      .select()
      .from('scan')
      .where('company_id', companyId)
      .andWhere('id', scanId)
    return { scan }
  } catch (error) {
    log.withError(error).error('searchAssetScanModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Returns list of server and web asset data
 *
 * @param {object} provider
 * @param {object} loggedUserInfo
 * @returns {Promise<{ error?: string, assets?: string }>} assets: list of ip address, url and network / netmask
 */
export const searchAssetScanModel = async (provider, loggedUserInfo = {}) => {
  try {
    const { companyId, id: userId } = loggedUserInfo
    const userGroups = await getUserGroupIds(userId)
    const ipsRequest = prismaClient.asset_server.findMany({
      where: {
        asset: {
          company_id: companyId,
          AND: loggedUserInfo.roles.includes('admin')
            ? {}
            : {
                group_asset: {
                  some: {
                    group_id: {
                      in: userGroups,
                    },
                  },
                },
              },
        },
      },
      include: {
        ip: {
          select: {
            address: true,
            asset_server_id: true,
          },
          where: {
            address: {
              not: null,
            },
          },
        },
      },
    })
    const urlsRequest = prismaClient.asset_web.findMany({
      select: {
        id: true,
        url: true,
      },
      where: {
        asset: {
          company_id: companyId,
          AND: loggedUserInfo.roles.includes('admin')
            ? {}
            : {
                group_asset: {
                  some: {
                    group_id: {
                      in: userGroups,
                    },
                  },
                },
              },
        },
        url: {
          not: null,
        },
      },
    })
    const networksRequest = prismaClient.asset_network.findMany({
      select: {
        id: true,
        network: true,
        netmask: true,
      },
      where: {
        asset: {
          company_id: companyId,
          AND: loggedUserInfo.roles.includes('admin')
            ? {}
            : {
                group_asset: {
                  some: {
                    group_id: {
                      in: userGroups,
                    },
                  },
                },
              },
        },
        network: {
          not: null,
        },
        AND: {
          netmask: {
            not: null,
          },
        },
      },
    })
    let [ips, urls, networks] = await prismaClient.$transaction([
      ipsRequest,
      urlsRequest,
      networksRequest,
    ])

    ips = ips.flatMap(({ ip }) =>
      ip.map(({ address, asset_server_id }) => ({
        id: asset_server_id,
        address,
      }))
    )

    urls = urls.map(({ id, url }) => ({
      id,
      address: url,
    }))

    networks = networks.map(({ id, network, netmask }) => ({
      id,
      address: `${network}/${netmask}`,
    }))

    return {
      assets: ips.concat(urls, networks),
    }
  } catch (error) {
    log.withError(error).error('searchAssetScanModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Get the list of all phishing scenarios
 *
 * @param {object} provider
 * @returns {Promise<{ error?: string, scenarios?: Object }>} scenarios: List of phishing scenarios
 */
export const searchPhishingScenariosModel = async (provider) => {
  const { knex } = provider
  try {
    const scenarios = await knex
      .select('id', 'name', 'description', 'severity')
      .from('phishing_scenario')

    return { scenarios }
  } catch (error) {
    log.withError(error).error('searchPhishingScenariosModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Return the datas for the vulnerability scan report
 *
 * @param {object} provider
 * @param {object} params parameters of the query
 * @param {number} params.scanId Id of the scan for which to get the report
 * @returns {Promise<{ error?: string, scanReport?: Object }>} scanReport: Data of the scan,
 * the vulnerabilities and assets identified by the scan
 */
export const getScanReportModel = async (provider, params) => {
  const { knex } = provider
  const { scanId } = params
  try {
    const [scan] = await knex
      .select({
        scan_id: 'sc.id',
        name: 'sc.name',
        probe: 'prb.name',
        cdate: 'sc.cdate',
        sdate: 'sc.sdate',
        fdate: 'sc.fdate',
        start_date: 'sc.start_date',
        end_date: 'sc.end_date',
        start_time: 'sc.start_time',
        end_time: 'sc.end_time',
        label: 'sl.label',
        status: 'sc.status',
      })
      .from('scan as sc')
      .leftJoin({ prb: 'probe' }, { 'prb.id': 'sc.probe_id' })
      .leftJoin({ sl: 'scan_label' }, { 'sl.type': 'sc.scan_type' })
      .where('sc.id', scanId)

    const assetScope = await knex
      .select({
        asset_id: 'sa.asset_id',
        asset_name: 'ast.name',
        asset_type: 'ast.type',
      })
      .distinctOn('sa.asset_id')
      .from({ sa: 'scan_asset' })
      .innerJoin({ ast: 'asset' }, { 'ast.id': 'sa.asset_id' })
      .where('scan_id', scanId)

    const scanResult = await knex
      .select()
      .from('scan_vulnerability_report')
      .where('scan_id', scanId)

    const vulnerabilities = await knex
      .select()
      .distinctOn('vul_cve.*')
      .from({ vul_cve: 'vulnerability_has_cve' })
      .innerJoin(
        { svr: 'scan_vulnerability_report' },
        { 'svr.vulnerability_id': 'vul_cve.id' }
      )
      .where({ 'svr.scan_id': scanId })

    return {
      scanReport: {
        scan: scan,
        scope: assetScope,
        vulnerabilities: vulnerabilities,
        scan_result_vulnerabilities: scanResult,
      },
    }
  } catch (error) {
    log.withError(error).error('getScanReportModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Create new scan_asset entry
 *
 * @param {object} provider
 * @param {object} params parameters of the query, which are the scan asset data
 */
export const createScanAssetModel = async (provider, params) => {
  const { knex } = provider
  const {
    scan_id,
    asset_id,
    port_id = null,
    ip_id = null,
    uri_id = null,
    vulnerability_asset_id = null,
    cpe_asset_id = null,
    site_map_id = null,
    cipher_suite_id = null,
  } = params

  try {
    await knex.transaction(async (tx) => {
      await tx('scan_asset').insert({
        scan_id,
        asset_id,
        port_id,
        ip_id,
        uri_id,
        vulnerability_asset_id,
        cpe_asset_id,
        site_map_id,
        cipher_suite_id,
      })
    })

    return { status: SUCCESS }
  } catch (error) {
    log.withError(error).error('createScanAssetModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Create a new scan
 *
 * @param {object} provider
 * @param {object} params parameters of the query, which are the scan data
 * @param {object} loggedUserInfo
 * @returns {Promise<{ error?: string, status?: string }>} id: id of the new created scan
 */
export const createScanModel = async (
  provider,
  params,
  loggedUserInfo = {}
) => {
  const {
    type,
    name = '',
    probe = null,
    startDate = null,
    //endDate is not really used at the moment, but it might become useful.
    endDate = null,
    startTime = null,
    endTime = null,
    status = null,
    scanParams,
  } = params
  // Guards
  if (
    !Array.isArray(scanParams?.assets) &&
    !Array.isArray(scanParams?.userAssets)
  ) {
    log.error('Cannot create scan without corresponding assets')
    return { error: 'ValidationError' }
  }

  try {
    const serverProbe = await prismaClient.probe.findFirst({
      where: {
        probe_type: 'SERVER',
      },
    })
    const { companyId } = loggedUserInfo
    const SCHEDULED_STATUS = status || 'New'
    const scanIds = []

    const parsedStartDate = !startDate ? null : new Date(startDate)

    const parsedEndDate = !endDate ? null : new Date(endDate)

    /* We used to add into database only "hh:mm" by knex, but it is impossible with Prisma, it would throw this error :
    Got invalid value 'hh:mm' on prisma. Provided string   expected DateTime or Null 
    To fix it, we had to rebuild an actual date, which is converted by Prisma afterward.
    */
    const fullStartTime = startTime
      ? new Date(parsedStartDate.setHours(...startTime.split(':')))
      : null
    // We always have a startDate, so we just check if we've got a start time and build the dataTime

    const fullEndTime = endTime // if we dont get a endDate, we will put endTime to null by default.
      ? new Date(
          parsedStartDate.setHours(...endTime.split(':'))
        ) /* the new Date is just about building the request, so it should be based on a sure value
      it will only register in dataBase the hour, the date doesn't really matters. */
      : null

    for (let idx in type) {
      const finalProbeId = type[idx] === 'phish' ? serverProbe?.id : probe
      const scanId = await prismaClient.scan.create({
        data: {
          company_id: companyId,
          probe_id: finalProbeId,
          name: name,
          start_date: parsedStartDate,
          end_date: parsedEndDate,
          start_time: fullStartTime,
          end_time: fullEndTime,
          scan_type: type[idx],
          status: SCHEDULED_STATUS,
          parameters: scanParams,
        },
        select: {
          id: true,
        },
      })
      scanIds.push(scanId)
    }
    return { id: scanIds }
  } catch (error) {
    log.withError(error).error('createScanModel')
    return { error: MODEL_ERROR }
  }
}

/**
 * Update a scan
 *
 * @param {object} provider
 * @param {number} id id of the scan to update
 * @param {object} params parameters of the query
 * @param {object} params.status new status of the scan to update
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns {Promise<{ error?: string, status?: string}>} status: SUCCESS
 */
export const updateScanModel = async (provider, id, params) => {
  const { knex } = provider
  const { status = null } = params
  try {
    await knex.transaction(async (tx) => {
      await tx('scan').update({ status }).where('scan.id', id)
    })
    return { status: SUCCESS }
  } catch (error) {
    log.withError(error).error('updateScanModel')
    return { error: MODEL_ERROR }
  }
}

export default {
  searchScansModel,
  createScanModel,
}
