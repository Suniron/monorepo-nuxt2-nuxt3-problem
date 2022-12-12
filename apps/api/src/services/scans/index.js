import { parseNmap } from './nmap'
import generate from './reportGenerator'
import { scanAPIs } from '@/api/store'

import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'
const fs = require('fs')
const parser = require('fast-xml-parser')

export const searchScansService = async (params, accessToken = '') => {
  const { error, scans, total } = await scanAPIs.searchScansStoreAPI(
    params,
    accessToken,
  )
  // const validStates = ['scheduled', 'pending', 'failed', 'completed']
  const formatScan = scan => ({
    ...scan,
    completedAt: scan.fdate,
    createdAt: scan.cdate,
    startedAt: scan.sdate,
  })

  return error
    ? createServiceError(error)
    : {
        scans: scans.map(formatScan),
        total,
      }
}

const getOs = (product) => {
  if (product.toLowerCase().includes('debian'))
    return 'debian'
  else if (product.toLowerCase().includes('windows'))
    return 'windows'
  else if (product.toLowerCase().includes('ubuntu'))
    return 'ubuntu'
  else if (product.toLowerCase().includes('redhat'))
    return 'redhat'
  else return product
}

const parseOpenvas = async (params) => {
  try {
    const tagsRe = /cvss_base_vector=(?<cvss>[\s\S]*?)\|summary=(?<desc>[\s\S]*?)\|insight=(?<insight>[\s\S]*?)\|affected=(?<affected>[\s\S]*?)\|impact=(?<impact>[\s\S]*?)\|solution=(?<solution>[\s\S]*?)\|vuldetect=(?<vuldetect>[\s\S]*?)\|solution_type=(?<solution_type>[\s\S]*)/gm
    const cpeRe = /(cpe:\/(a|o|h):(.*?)(:(.*?)(:(.*?)(:(.*?)(:(.*?)(:(.*?)|$|\n)|$|\n)|$|\n)|$|\n)|$|\n))/g
    const cipherRe = /([\s\S]*?)' cipher suites accepted by this service via the ([\s\S]*?) protocol.[\n]*([A-Z0-9_\n]*)\n/gm
    const options = {
      ignoreAttributes: false,
    }
    const { report } = parser.parse(params.file.data.toString(), options)
    const res = report.report.host.reduce((res, elt) => {
      res[elt.ip] = {}
      return res
    }, {})
    report.report.ports.port.forEach((p) => {
      if (!Object.keys(res[p.host]).includes('ports'))
        res[p.host].ports = {}
      const number = p['#text'].split('/')[0]
      const proto = p['#text'].split('/')[1]
      if (!isNaN(parseInt(number))) {
        res[p.host].ports[p['#text']] = {
          ciphers: [],
          number,
          protocol: proto,
          status: 'open',
        }
      }
    })
    const vulns = {}

    report.report.results.result.forEach((elt) => {
      const oid = elt.nvt['@_oid']
      const ip = elt.host['#text']
      res[ip].type = 'SERVER'
      if (elt.threat.toLowerCase() !== 'log') {
        if (!Object.keys(vulns).includes(oid)) {
          const reMatch = elt.nvt.tags.match(tagsRe)
          vulns[oid] = {
            affected: reMatch.affected,
            description: reMatch.desc,
            insight: reMatch.insight,
            name: elt.name,
            refs:
              elt.nvt.refs === undefined
                ? []
                : Array.isArray(elt.nvt.refs.ref)
                  ? elt.nvt.refs.ref.reduce((resRef, ref) => {
                    resRef.push({ type: ref['@_type'], value: ref['@_id'] })
                    return resRef
                  }, [])
                  : elt.nvt.refs.ref.constructor === Object
                    ? [
                        {
                          type: elt.nvt.refs.ref['@_type'],
                          value: elt.nvt.refs.ref['@_id'],
                        },
                      ]
                    : [],
            remediation: elt.nvt.solution['#text'],
            vulndetect: reMatch.vulndetect,
          }
        }
        if (!Object.keys(res[ip]).includes('astVulns'))
          res[ip].astVulns = []
        res[ip].hostname = elt.host.hostname
        res[ip].astVulns.push({
          code: elt.nvt.severities.severity.value,
          details: elt.description,
          port: elt.port,
          score: elt.nvt.severities.severity.score,
          severity: elt.threat,
          version: elt.nvt.severities.severity['@_type'].includes('v2') ? 2 : 3,
          vuln_id: oid,
        })
      }
      else if (elt.name.toLowerCase() === 'cpe inventory') {
        if (!Object.keys(res[ip]).includes('cpes'))
          res[ip].cpes = []
        const cpeMatch = elt.description.matchAll(cpeRe)
        const cpeArray = [...cpeMatch]
        let os = ''
        cpeArray.forEach((cpe) => {
          res[ip].cpes.push({
            cpe: cpe[0].trim(),
            edition: cpe[11],
            language: cpe[13],
            product: cpe[5],
            type:
              cpe[2] === 'a'
                ? 'Application'
                : cpe[2] === 'o'
                  ? 'OS'
                  : 'Hardware',
            update: cpe[9],
            vendor: cpe[2] === 'o' ? (os = getOs(cpe[5])) : cpe[3],
            version: cpe[7],
          })
        })
        res[ip].os = os
      }
      else if (oid === '1.3.6.1.4.1.25623.1.0.802067') {
        const cipherMatch = elt.description.matchAll(cipherRe)
        const cipherArray = [...cipherMatch]
        cipherArray.forEach((cipher) => {
          if (cipher[3] !== '') {
            res[ip].ports[elt.port].ciphers.push({
              names: [],
              strength: cipher[1],
              tls: cipher[2],
            })
            cipher[3].split('\n').forEach((name) => {
              if (name !== '') {
                res[ip].ports[elt.port].ciphers[
                  res[ip].ports[elt.port].ciphers.length - 1
                ].names.push(name)
              }
            })
          }
        })
      }
    })
    return { hosts: res, vulns }
    // fs.writeFile('/tmp/res.json', JSON.stringify(res, null, 2), (err) => {})
  }
  catch (error) {
    log.withError(error).error('parseOpenvas')
    return createServiceError(error)
  }
}

const getSeverity = { 1: 'low', 2: 'medium', 3: 'high', 4: 'critical' }

const parseNessus = (params) => {
  try {
    // const tagsRe = /cvss_base_vector=(?<cvss>[\s\S]*?)\|summary=(?<desc>[\s\S]*?)\|insight=(?<insight>[\s\S]*?)\|affected=(?<affected>[\s\S]*?)\|impact=(?<impact>[\s\S]*?)\|solution=(?<solution>[\s\S]*?)\|vuldetect=(?<vuldetect>[\s\S]*?)\|solution_type=(?<solution_type>[\s\S]*)/gm
    const cpeRe = /(cpe:\/(a|o|h):(.*?)(:(.*?)(:(.*?)(:(.*?)(:(.*?)(:(.*?)|$)|$)|$)|$)|$))/g
    // const cipherRe = /([\s\S]*?)' cipher suites accepted by this service via the ([\s\S]*?) protocol.[\n]*([A-Z0-9_\n]*)\n/gm
    const options = {
      ignoreAttributes: false,
    }
    const buf = params.file.data.toString()
    const res = parser.parse(buf, options)
    const rootKey = Object.keys(res)[0]
    const hosts = {}
    const vulns = {}

    for (const index in res[rootKey].Report.ReportHost) {
      const reportHost = res[rootKey].Report.ReportHost[index]
      const ip = reportHost['@_name']
      hosts[ip] = {}
      hosts[ip].type = 'SERVER'
      hosts[ip].ports = {}
      hosts[ip].cpes = []
      for (const tagIdx in reportHost.HostProperties.tag) {
        const tag = reportHost.HostProperties.tag[tagIdx]
        if (tag['@_name'].includes('listen')) {
          const num = tag['#text'].split(':')
          let key = num[num.length - 1]
          if (tag['@_name'].includes('tcp'))
            key += '/tcp'
          else key += '/udp'
          hosts[ip].ports[key] = {
            ciphers: [],
            number: key.split('/')[0],
            protocol: key.split('/')[1],
            status: 'open',
          }
        }
        else if (tag['@_name'].includes('cpe')) {
          const cpeMatch = tag['#text'].split(' ')[0].matchAll(cpeRe)
          const cpe = [...cpeMatch][0]
          hosts[ip].cpes.push({
            cpe: cpe[0].trim(),
            edition: cpe[11],
            language: cpe[13],
            product: cpe[5],
            type:
              cpe[2] === 'a'
                ? 'Application'
                : cpe[2] === 'o'
                  ? 'OS'
                  : 'Hardware',
            update: cpe[9],
            vendor: cpe[2] === 'o' ? (hosts[ip].os = getOs(cpe[5])) : cpe[3],
            version: cpe[7],
          })
        }
        else if (tag['@_name'].includes('hostname')) {
          hosts[ip].hostname = tag['#text']
        }
        else if (tag['@_name'].includes('wmi-domain')) {
          hosts[ip].domain = tag['#text']
        }
      }
      for (const ridx in reportHost.ReportItem) {
        const reportItem = reportHost.ReportItem[ridx]
        if (reportItem['@_severity'] !== '0') {
          if (!Object.keys(vulns).includes(reportItem['@_pluginID'])) {
            vulns[reportItem['@_pluginID']] = {
              description: reportItem.description,
              name: reportItem['@_pluginName'],
              refs: (reportItem.cve
                ? Array.isArray(reportItem.cve)
                  ? reportItem.cve.reduce((res, c) => {
                    res.push({ type: 'cve', value: c })
                    return res
                  }, [])
                  : [{ type: 'cve', value: reportItem.cve }]
                : []
              ).concat(
                reportItem.see_also
                  ? reportItem.see_also.split('\n').reduce((res, e) => {
                    res.push({ type: 'url', value: e })
                    return res
                  }, [])
                  : [],
              ),
              remediation: reportItem.solution,
            }
          }
          if (!Object.keys(hosts[ip]).includes('astVulns'))
            hosts[ip].astVulns = []
          if (
            reportItem['@_port'] !== '0'
            && !Object.keys(hosts[ip].ports).includes(
              `${reportItem['@_port']}/${reportItem['@_protocol']}`,
            )
          ) {
            hosts[ip].ports[
              `${reportItem['@_port']}/${reportItem['@_protocol']}`
            ] = {
              ciphers: [],
              number: reportItem['@_port'],
              protocol: reportItem['@_protocol'],
              status: 'open',
            }
          }
          hosts[ip].astVulns.push({
            code: Object.keys(reportItem).includes('cvss3_vector')
              ? reportItem.cvss3_vector
              : reportItem.cvss_vector,
            details: reportItem.plugin_output,
            exploit_available: reportItem?.exploit_available || undefined,
            exploit_code_maturity:
              reportItem?.exploit_code_maturity || undefined,
            exploit_framework_core:
              reportItem?.exploit_framework_core || undefined,
            exploitability_ease: reportItem?.exploitability_ease || undefined,
            exploited_by_malware: reportItem?.exploited_by_malware || undefined,
            impactScore: reportItem?.cvssV3_impactscore || undefined,
            patch_publication_date:
              reportItem?.patch_publication_date || undefined,
            plugin_modification_date:
              reportItem?.plugin_modification_date || undefined,
            port:
              reportItem['@_port'] === '0'
                ? `general/${reportItem['@_protocol']}`
                : `${reportItem['@_port']}/${reportItem['@_protocol']}`,
            score: Object.keys(reportItem).includes('cvss3_base_score')
              ? reportItem.cvss3_base_score
              : reportItem.cvss_base_score,
            severity: getSeverity[reportItem['@_severity']],
            temporal_score: Object.keys(reportItem).includes(
              'cvss3_temporal_score',
            )
              ? reportItem.cvss3_temporal_score
              : Object.keys(reportItem).includes('cvss_temporal_score')
                ? reportItem.cvss_temporal_score
                : undefined,
            temporal_vector: Object.keys(reportItem).includes(
              'cvss3_temporal_vector',
            )
              ? reportItem.cvss3_temporal_vector
              : Object.keys(reportItem).includes('cvss_temporal_vector')
                ? reportItem.cvss_temporal_vector
                : undefined,
            version: Object.keys(reportItem).includes('cvss3_base_score')
              ? 3
              : 2,
            vuln_id: reportItem['@_pluginID'],
            vuln_publication_date:
              reportItem?.vuln_publication_date || undefined,
          })
        }
        else if (
          reportItem['@_pluginID'] === '11219'
          && !Object.keys(hosts[ip].ports).includes(
            `${reportItem['@_port']}/${reportItem['@_protocol']}`,
          )
        ) {
          hosts[ip].ports[
            `${reportItem['@_port']}/${reportItem['@_protocol']}`
          ] = {
            ciphers: [],
            number: reportItem['@_port'],
            protocol: reportItem['@_protocol'],
            status: 'open',
          }
        }
      }
    }
    return { hosts, vulns }
  }
  catch (error) {
    log.withError(error).error('parseNessus')
    return createServiceError(error)
  }
}

const decodeHtml = (str) => {
  try {
    return typeof str === 'string' && str !== ''
      ? str
        .replaceAll('&apos;', '\'')
        .replaceAll('&quot;', '"')
        .replaceAll('&amp;', '&')
      : null
  }
  catch (error) {
    log.withError(error).error('decodeHtml')
    return ''
  }
}

const parseNessusHardening = (params) => {
  try {
    const options = {
      ignoreAttributes: false,
    }
    const buf = params.file.data.toString('ascii')
    const res = parser.parse(buf, options)
    const rootKey = Object.keys(res)[0]
    const hosts = {}
    const vulns = {}

    const arrHost = Array.isArray(res[rootKey].Report.ReportHost)
      ? res[rootKey].Report.ReportHost
      : [res[rootKey].Report.ReportHost]
    for (const index in arrHost) {
      const reportHost = arrHost[index]
      const ip = reportHost['@_name']
      hosts[ip] = {}
      hosts[ip].type = 'SERVER'
      hosts[ip].ports = {}
      hosts[ip].cpes = []

      for (const ridx in reportHost.ReportItem) {
        const reportItem = reportHost.ReportItem[ridx]
        if (reportItem['@_pluginFamily'] === 'Policy Compliance') {
          const name = decodeHtml(reportItem['cm:compliance-check-name'])
          if (!Object.keys(vulns).includes(name)) {
            vulns[name] = {
              baseline: reportItem['cm:compliance-audit-file'],
              description: decodeHtml(reportItem['cm:compliance-info']),
              insight: decodeHtml(reportItem['cm:compliance-policy-value']),
              name,
              remediation: decodeHtml(reportItem['cm:compliance-solution']),
              type: 'hardening',
            }
          }
          if (!Object.keys(hosts[ip]).includes('astVulns'))
            hosts[ip].astVulns = []
          hosts[ip].astVulns.push({
            details: decodeHtml(reportItem['cm:compliance-actual-value']),
            status:
              reportItem['cm:compliance-result'] === 'PASSED'
                ? 'closed'
                : 'open',
            vuln_id: name,
          })
        }
      }
    }
    return { hosts, vulns }
  }
  catch (error) {
    log.withError(error).error('parseNessusHardening')
    return createServiceError(error)
  }
}

export const parseScanResultService = async (params, accessToken = '') => {
  try {
    let hosts
    let vulns
    if (params.type === 'openvas') {
      log.info('parseScanResultService > openvas')
      ;({ hosts, vulns } = await parseOpenvas(params, accessToken))
    }
    else if (params.type === 'nessus') {
      ({ hosts, vulns } = parseNessus(params, accessToken))
    }
    else if (params.type === 'nmap') {
      hosts = parseNmap(params.file.data.toString().split('\n'))
      // fs.writeFile('/tmp/nmap.json', JSON.stringify(IPs, null, 2), (err) => {})
      vulns = []
    }
    else if (params.type === 'hardening') {
      ({ hosts, vulns } = parseNessusHardening(params, accessToken))
    }
    const { status } = await scanAPIs.parseScanResult(
      {
        addToCy: params.addToCy,
        cyId: params.cyId,
        hosts,
        name: params.scanName,
        scanType: params.type,
        vulns,
      },
      accessToken,
    )
    return { status }
  }
  catch (error) {
    log.withError(error).error('parseScanResultService')
    return createServiceError(error)
  }
}

export const updateScanService = async (id, params, accessToken = '') => {
  try {
    const result = await scanAPIs.updateScan(id, params, accessToken)

    if (result?.error)
      return createServiceError(result.error)

    return result
  }
  catch (error) {
    log.withError(error).error('updateScanService')
    return createServiceError(error)
  }
}

export const getScanDetailsService = async (id, accessToken = '') => {
  const result = await scanAPIs.getScanDetails(id, accessToken)

  if ('error' in result)
    createServiceError(result.error)
  return result
}

/**
 * @param {*} id
 * @param {*} params
 * @param {*} accessToken
 * @returns {Buffer}
 */
export const generateScanReportService = async (
  id,
  params,
  accessToken = '',
) => {
  try {
    const scanData = await scanAPIs.getScanReport(id, accessToken)

    if (scanData && 'error' in scanData)
      return scanData

    return await generate(scanData)
  }
  catch (error) {
    log.withError(error).error('generateScanReportService')
    return createServiceError(error)
  }
}

export const writeTmp = (q) => {
  fs.writeFile('/tmp/compliance.json', JSON.stringify(q, null, 2))
}
