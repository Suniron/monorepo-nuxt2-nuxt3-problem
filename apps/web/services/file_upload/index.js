const getEndpoint = id => (id ? `/files/${id}` : '/files')

export const uploadFiles = async (axios, params) => {
  const { data } = await axios.post(getEndpoint(), params)
  return data.uuid
}

export const downloadFile = async (axios, id) => {
  const response = await axios({
    method: 'GET',
    responseType: 'blob',
    url: getEndpoint(id),
  })
  return response
}

/**
 *  Start download file in browser
 *
 * @param {import('@nuxtjs/axios').NuxtAxiosInstance} axios
 * @param {string} uuid
 */
export const startDownloadFile = async (axios, uuid) => {
  const resp = await downloadFile(axios, uuid)
  const fileUrl = window.URL.createObjectURL(new Blob([resp.data]))
  const fileLink = document.createElement('a')
  fileLink.href = fileUrl
  fileLink.setAttribute(
    'download',
    resp.headers['content-disposition'].split('=')[1],
  )
  document.body.appendChild(fileLink)
  fileLink.click()
}

export const processCSV = async (axios, params) => {
  const { data } = await axios.get('/files/processCSV', params)
  return {
    csvData: data.csvData,
    csvHeaders: data.csvHeaders,
    headers: data.headers,
  }
}
