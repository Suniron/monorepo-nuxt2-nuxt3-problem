import express from 'express'
import {
  uploadFilesController,
  downloadFileController,
  processCSVController,
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
