// @ts-check
import { throwHTTPError, throwInternalServerError } from '@/common/errors'
import {
  uploadFilesService,
  downloadFileService,
  processCSVService,
} from '@/services/file_upload'
const fs = require('fs')
const TMP_DIR = 'storage/'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const uploadFilesController = async (req, res, next) => {
  try {
    if (!req.files)
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    const { error, uuid } = await uploadFilesService(
      req.files.files,
      req.accessToken
    )
    if (error) throwHTTPError(error)
    const filePath = TMP_DIR + uuid
    if (!fs.existsSync(filePath)) req.files.files.mv(filePath)
    res.send({ uuid: uuid })
  } catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const downloadFileController = async (req, res, next) => {
  try {
    const { error, isAuthorized, fileData } = await downloadFileService(
      req.params?.id,
      req.accessToken
    )
    if (error) throwHTTPError(error)
    if (!isAuthorized) {
      return res.status(403).send()
    }

    if (!fs.existsSync(TMP_DIR + fileData.id)) {
      console.error(
        `ENOENT: no such file or directory, stat '${TMP_DIR}/${fileData.id}'`
      )
      throwInternalServerError({
        message: 'File not found',
      })
      return
    }

    res.setHeader('Content-Disposition', 'attachment;filename=' + fileData.name)
    res.setHeader('Content-Type', fileData.type)

    const fileStream = fs.createReadStream(TMP_DIR + fileData.id)
    fileStream.pipe(res)
  } catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const processCSVController = async (req, res, next) => {
  try {
    if (!req.files)
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    const { headers, csvData, csvHeaders } = await processCSVService(
      req.files.files,
      req.accessToken
    )
    res
      .status(201)
      .send({ headers: headers, csvData: csvData, csvHeaders: csvHeaders })
  } catch (error) {
    next(error)
  }
}
