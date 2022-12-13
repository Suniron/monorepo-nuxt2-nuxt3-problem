import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createIpController,
  deleteIpController,
  updateIpController,
} from '../../controllers/ips'

const router = express.Router()

const updateValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    address: Joi.string().required(),
    iface: Joi.string().allow(null, '').required(),
    mac: Joi.string().allow(null, '').required(),
    mask: Joi.string().allow(null, '').required(),
  }),
})

const createValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    assetId: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    address: Joi.string().required(),
    iface: Joi.string().allow(null, '').required(),
    mac: Joi.string().allow(null, '').required(),
    mask: Joi.string().allow(null, '').required(),
  }),
})
// router.get('/ips/:id', searchIpController)
router.patch('/ips/:id', updateValidation, updateIpController)
router.delete('/ips/:id', deleteIpController)
router.post('/ips/:assetId', createValidation, createIpController)

export default router
