const baselines = require('./baselines.json')

export const getScansChartDataService = async (axios, params) => {
  const { data } = await axios.get('/dashboard/scanHistory')
  // data.scanHistory = data.scanHistory.concat(scansChartData)
  /* const scans = Object.values(scansData)
    .filter((scan) => scan.status === 'Completed')
    .map((scan) => {
      const date = new Date(scan.date)
      const format = (date) => date.toISOString().split('T')[0]
      const isValidDate = (d) => d instanceof Date && !isNaN(d)

      return {
        date: isValidDate(date) ? format(date) : format(new Date(Date.now())),
        critical: scan.Critical,
        high: scan.High,
        medium: scan.Medium,
        low: scan.Low
      }
    }) */

  // return Promise.resolve(scans)
  return data
}

export const getScansListDataService = async (axios, params) => {
  const { page, pageSize } = params

  const queryParams = {
    page,
    pageSize,
  }

  // data.scans = data.scans.concat(scansData)
  const { data } = await axios.get('scans', { params: queryParams })
  return data
}

export const scheduleWebScan = async (axios, params) => {
  const {
    assets,
    hasInternal = false,
    startDate,
    endDate,
    startTime,
    endTime,
  } = params

  const payload = {
    assets,
    endDate,
    endTime,
    hasInternal,
    startDate,
    startTime,
    type: 'web',
  }
  const { data } = await axios.post('scans', payload)

  return data.id
}

export const scheduleNetworkScan = async (axios, params) => {
  const {
    ips,
    credentials,
    hasInternal = false,
    startDate,
    endDate,
    startTime,
    endTime,
  } = params

  const payload = {
    credentials,
    endDate,
    endTime,
    hasInternal,
    ips,
    startDate,
    startTime,
    type: 'network',
  }

  const { data } = await axios.post('scans', payload)
  return data.id
}

export const scheduleScan = async (axios, params) => {
  const { data } = await axios.post('scans', params)
  return data.id
}

export const updateScanService = async (axios, id, params) => {
  await axios.patch(`/scans/${id}`, params)
}

export const parseScanResult = async (axios, params) => {
  const { data } = await axios.post('/scans/result', params)
  return data
}

export const searchScanAssets = async (axios) => {
  const { data } = await axios.get('/scans/assets')
  return data.data
}

export const fetchBaselinesService = () => {
  return baselines
}

export const fetchPhishingScenarioService = async (axios) => {
  const { data } = await axios.get('/scans/phishing-scenarios')
  return data.data
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} id
 * @returns {{scan: object, scope: object[], vulnerabilities: object[], scan_result_vulnerabilities: object[]}}
 */
export const getScanDetails = async (axios, id) => {
  const { data } = await axios.get(`/scans/${id}/report`)
  return data
}

/**
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {number} id
 * @returns {{fileName: string, file: Blob}}
 */
export const downloadReportFile = async (axios, id) => {
  const response = await axios.get(`/scans/${id}/report/download`, {
    responseType: 'blob',
  })
  const fileName = response.headers['content-disposition'].match(
    /filename=(.+)/,
  )[1]
  const { data } = response
  return { file: data, fileName }
}
