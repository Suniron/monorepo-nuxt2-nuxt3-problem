import express from 'express'
import {
  deleteIpController,
  updateIpController,
  createIpController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/ips' or its corr... Remove this comment to see the full error message
} from '@/controllers/ips'

import { celebrate, Segments, Joi } from 'celebrate'

const router = express.Router()

const updateValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    address: Joi.string().required(),
    mac: Joi.string().allow(null, '').required(),
    iface: Joi.string().allow(null, '').required(),
    mask: Joi.string().allow(null, '').required(),
  }),
})

const createValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    assetId: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    address: Joi.string().required(),
    mac: Joi.string().allow(null, '').required(),
    iface: Joi.string().allow(null, '').required(),
    mask: Joi.string().allow(null, '').required(),
  }),
})
// router.get('/ips/:id', searchIpController)
router.patch('/ips/:id', updateValidation, updateIpController)
router.delete('/ips/:id', deleteIpController)
router.post('/ips/:assetId', createValidation, createIpController)

export default router
