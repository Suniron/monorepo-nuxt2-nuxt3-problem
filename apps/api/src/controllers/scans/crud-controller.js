// @ts-check
import { throwHTTPError } from '@/common/errors'
import {
  scheduleScanService,
  searchScanAssetsService,
  searchPhishingScenariosService,
} from '@/services/scans/schedule-service'
import {
  searchScansService,
  parseScanResultService,
  updateScanService,
  writeTmp,
  generateScanReportService,
  getScanDetailsService,
} from '@/services/scans'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const searchScansHandler = async (req, res, next) => {
  try {
    const { error, scans, total } = await searchScansService(
      req.query,
      req.accessToken
    )

    if (error) throwHTTPError(error)
    res.send({ scans, total })
  } catch (error) {
    req.log.withError(error).error('Error searching scans')
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const scheduleScanHandler = async (req, res, next) => {
  try {
    const { error, id } = await scheduleScanService(req.body, req.accessToken)

    if (error) throwHTTPError(error)

    res.send({ id })
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
export const parseScanResultController = async (req, res, next) => {
  try {
    if (!req.files)
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    const { status } = await parseScanResultService(
      { file: req.files.files, ...req.body },
      req.accessToken
    )
    res.status(201).send({ status })
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
export const searchScanAssetsController = async (req, res, next) => {
  try {
    const data = await searchScanAssetsService(req.accessToken)
    if (data.error) throwHTTPError(data.error)
    res.send({ data })
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
export const searchPhishingScenariosController = async (req, res, next) => {
  try {
    const data = await searchPhishingScenariosService(req.accessToken)
    if (data.error) throwHTTPError(data.error)
    res.send({ data })
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
export const updateScanController = async (req, res, next) => {
  try {
    const data = await updateScanService(
      req.params.id,
      req.body,
      req.accessToken
    )
    if (data?.error) throwHTTPError(data.error)
    res.send()
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
export const getScanDetailsController = async (req, res, next) => {
  try {
    const data = await getScanDetailsService(req.params.id, req.accessToken)

    if ('error' in data) throwHTTPError(data.error)
    res.send(data)
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
export const generateScanReportController = async (req, res, next) => {
  try {
    const { error, data, file } = await generateScanReportService(
      req.params.id,
      req.body,
      req.accessToken
    )

    if (error) throwHTTPError(error)

    res.setHeader('Content-Length', file.length)
    res.setHeader('Content-Type', 'application/docx')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + data.fileName
    )
    res.send(file)
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
export const writeTmpContorller = async (req, res, next) => {
  writeTmp(req.body)
  res.status(201)
}

export default {
  scheduleScanHandler,
}
