import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  downloadFileController,
  processCSVController,
  uploadFilesController,
} from '../../controllers/file_upload'

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
