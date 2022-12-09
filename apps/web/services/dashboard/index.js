// import scansChartData from '../scans/scan-chart.json'
// import riskAsset from './risk.json'

export const getDashboardData = async (axios, params) => {
  const { data } = await axios.get('/dashboard', {
    params,
  })
  // data.scanHistory = data.scanHistory.concat(scansChartData)
  // data.riskAsset = riskAsset
  // console.log(data)
  return data
}

export const fetchDashboards = async (axios) => {
  const { data } = await axios.get('/dashview')
  return data.dashboards
}

export const updateDashboardUser = async (axios, id, params) => {
  await axios.post(`/dashview/${id}`, params)
}
