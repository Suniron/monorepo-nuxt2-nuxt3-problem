export const searchProbesService = async (axios) => {
  const { data } = await axios.get('/probes')
  return data.data
}
export const updateProbesService = async (axios, id, body) => {
  const data = await axios.patch(`/probes/${id}`, body)
  return data
}
