import { fileAPIs } from '@/api/store'
import { VALIDATION_ERROR } from '@/common/constants'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'
const parse = require('csv-parse')

export const uploadFilesService = async (params, accessToken = '') => {
  try {
    const { name, size, md5, mimetype } = params
    const { error, uuid } = await fileAPIs.uploadFiles(
      { md5, mimetype, name, size },
      accessToken,
    )
    return error ? createServiceError(error) : { uuid }
  }
  catch (error) {
    log.withError(error).error('uploadFilesService')
    return createServiceError(error)
  }
}

export const downloadFileService = async (id, accessToken = '') => {
  try {
    const { error, isAuthorized, fileData } = await fileAPIs.downloadFile(
      id,
      accessToken,
    )
    return error ? createServiceError(error) : { fileData, isAuthorized }
  }
  catch (error) {
    log.withError(error).error('downloadFileService')
    return createServiceError(error)
  }
}

export const processCSVService = async (params, accessToken = '') => {
  try {
    const { data } = params
    const isAuthorized = await fileAPIs.processCSV(accessToken)
    if (isAuthorized) {
      const expectedHeaders = [
        'name',
        'type',
        'os',
        'position',
        'mail',
        'tel',
        'url',
        'language',
        'address',
        'mac',
        'mask',
        'iface',
        'owner',
        'maintainer',
        'owner',
        'location',
      ]

      const process = async () => {
        const headers = []
        const csvData = []
        const csvHeaders = []
        const parser = parse(data, {
          on_record: (record, context) => {
            return record.map(e => (e === '' ? undefined : e))
          },
        })
        const temp = {}
        const temp2 = {}
        const multiRecord = /([a-zA-Z]+)[0-9]+/
        let first = true
        for await (const record of parser) {
          if (first) {
            record.forEach((elt, ind) => {
              if (multiRecord.test(elt))
                elt = elt.match(multiRecord)[1]
              const index = expectedHeaders.findIndex(
                h => h === elt.toLowerCase(),
              )
              if (index !== -1) {
                if (expectedHeaders[index] in temp) {
                  headers[temp[expectedHeaders[index]] - 1].csv.push(ind)
                }
                else {
                  temp[expectedHeaders[index]] = headers.push({
                    csv: [ind],
                    key: expectedHeaders[index],
                  })
                }
              }
              if (elt in temp2)
                csvHeaders[temp2[elt] - 1].indexes.push(ind)
              else
                temp2[elt] = csvHeaders.push({ csv: elt, indexes: [ind] })
            })
            first = false
          }
          else { csvData.push(record === '' ? undefined : record) }
        }
        return { csvData, csvHeaders, headers }
      }

      const { headers, csvData, csvHeaders } = await process()

      return { csvData, csvHeaders, headers }
    }
    else { return createServiceError(VALIDATION_ERROR) }
  }
  catch (error) {
    log.withError(error).error('processCSVService')
    return createServiceError(error)
  }
}
