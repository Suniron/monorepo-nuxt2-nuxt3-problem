import express from 'express'
import {
  generateScanReportController,
  getScanDetailsController,
  parseScanResultController,
  scheduleScanHandler,
  searchPhishingScenariosController,
  searchScanAssetsController,
  searchScansHandler,
  updateScanController,
  writeTmpContorller,
} from '@/controllers/scans/crud-controller'
import { isAuthorizedController } from '@/controllers/auth'

const router = express.Router()

// Validations
/* const scheduleScanPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    type: Joi.string().required().valid('web', 'network'),
    hasInternal: Joi.boolean().optional(),
    startDate: Joi.string().optional().allow('', null),
    endDate: Joi.string().optional().allow('', null),
    startTime: Joi.string().optional().allow('', null),
    endTime: Joi.string().optional().allow('', null),

    // Web scheduling
    assets: Joi.array()
      .items({
        url: Joi.string().required(),
        auth: Joi.object({
          type: Joi.string()
            .required()
            .valid('login', 'basic', 'ntlm', 'digest', 'certificate'),
          username: Joi.string().when('type', {
            is: Joi.string().valid('login', 'basic', 'ntlm', 'digest'),
            then: Joi.required(),
          }),
          password: Joi.string().when('type', {
            is: Joi.string().valid('login', 'basic', 'ntlm', 'digest'),
            then: Joi.required(),
          }),
          publicCrt: Joi.string(),
          privateKey: Joi.string(),
          caCrt: Joi.string(),
        }).optional(),
      })
      .when('type', {
        is: Joi.string().valid('web'),
        then: Joi.required(),
      }),

    // Network Scheduling
    ips: Joi.array()
      .items(
        Joi.string().ip({
          version: ['ipv4', 'ipv6'],
          cidr: 'optional',
        })
      )
      .when('type', {
        is: Joi.string().valid('network'),
        then: Joi.required(),
      }),
    credentials: Joi.array()
      .items({
        type: Joi.string().valid('ssh', 'wmi', 'ssh-key').required(),
        domain: Joi.string().optional().allow(null, ''),
        username: Joi.string().required(),
        password: Joi.string()
          .when('type', {
            is: Joi.string().valid('ssh', 'wmi'),
            then: Joi.string().required(),
          })
          .optional()
          .allow(null, ''),
        key: Joi.string()
          .when('type', {
            is: Joi.string().valid('ssh-key'),
            then: Joi.string().required(),
          })
          .optional()
          .allow(null, ''),
      })
      .optional(),
  }),
}) */

// Single Routes
router.get('/scans', searchScansHandler)
router.post('/scans', scheduleScanHandler) // scheduleScanPayloadValidation,
router.patch('/scans/:id', updateScanController)
router.get('/scans/:id/report/download', generateScanReportController)
router.get('/scans/:id/report', getScanDetailsController)
router.post('/scans/result', isAuthorizedController, parseScanResultController)
router.get('/scans/assets', searchScanAssetsController)
router.get('/scans/phishing-scenarios', searchPhishingScenariosController)
router.post('/scans/tmp', writeTmpContorller)
// List Routes

export default router
