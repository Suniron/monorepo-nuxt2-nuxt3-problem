// @ts-check
import { throwHTTPError } from '@/common/errors'
import { uploadFilesModel, downloadFile } from '@/models/file'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const uploadFilesController = async (req, res, next) => {
  try {
    const { error, uuid } = await uploadFilesModel(req.body, req.user)

    if (error) throwHTTPError(error)

    res.status(201).send({ uuid: uuid })
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
    const { error, data } = await downloadFile(
      req.user.companyId,
      req.params?.id
    )
    if (error) throwHTTPError(error)

    res.status(201).send({ isAuthorized: !!data, fileData: data })
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
    res.status(201).send({ isAuthorized: true })
  } catch (error) {
    next(error)
  }
}
