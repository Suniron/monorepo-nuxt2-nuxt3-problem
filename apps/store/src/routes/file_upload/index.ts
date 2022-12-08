import express from 'express'
import {
  uploadFilesController,
  downloadFileController,
  processCSVController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/file_upload' or ... Remove this comment to see the full error message
} from '@/controllers/file_upload'
import { celebrate, Segments, Joi } from 'celebrate'

const router = express.Router()

const getFilesIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
})

router.get('/files/processCSV', processCSVController)
router.get('/files/:id', getFilesIdValidation, downloadFileController)
router.post('/files', uploadFilesController)

export default router
