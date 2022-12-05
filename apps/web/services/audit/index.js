export const fetchComplianceService = async (axios, params = {}) => {
  const { data } = await axios.get('/compliance', { params })
  return data
}

export const createComplianceService = async (axios, params) => {
  const { data } = await axios.post('/compliance', params)
  return data.id
}
