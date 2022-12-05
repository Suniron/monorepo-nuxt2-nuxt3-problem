export const generateService = async (axios) => {
  const { data } = await axios.get('/reports')
  return data.docx
}
