import type { NuxtAxiosInstance } from '@nuxtjs/axios'

const getEndpoint = (id?: string) => (id ? `/files/${id}` : '/files')

export const uploadFiles = async (axios: NuxtAxiosInstance, formData: FormData) => {
  const { data } = await axios.post(getEndpoint(), formData)
  return data.uuid
}

export const downloadFile = async (axios: NuxtAxiosInstance, id: string) => {
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
export const startDownloadFile = async (axios: NuxtAxiosInstance, uuid: string) => {
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

export const processCSV = async (axios: NuxtAxiosInstance, formData: FormData): Promise<{
  csvData: string[][]
  csvHeaders: {
    /**
     * Name of the header
     */
    csv: string
    /**
     * Indexes of the header
     * @example [0, 1, 2]
     */
    indexes: number[] }[]
  headers: {
    /**
     * Indexes of the header
     */
    csv: number[]
    /**
     * Name of the header
     */
    key: string }[]
}> => {
  const { data } = await axios.post('/files/csv/process', formData)
  return {
    csvData: data.csvData,
    csvHeaders: data.csvHeaders,
    headers: data.headers,
  }
}
