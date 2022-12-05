export const getAvailableXratorDomains = async (axios) => {
  const { data } = await axios.get('/phishing-scenarios-domains')
  return data.data
}
