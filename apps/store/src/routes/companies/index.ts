// @ts-check
import express from 'express'
import {
  searchCompanyController,
  createCompanyController,
  searchCompanyLogoController,
  updateCompanyLogoController,
  deleteCompanyLogoController,
  updateCompanyController,
  getCompanyRiskController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/companies' or it... Remove this comment to see the full error message
} from '@/controllers/companies'
import { celebrate, Segments, Joi } from 'celebrate'

const router = express.Router()

// Validations
const createCompanyValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
  }),
})

const updateCompanyLogoValidation = celebrate({
  [Segments.BODY]: Joi.object({
    logo: Joi.string().required(),
  }),
})

// Routes
router.get('/companies', searchCompanyController)
router.get('/companies/:cid', searchCompanyController)
router.patch('/company', updateCompanyController)
router.post('/companies', createCompanyValidation, createCompanyController)
router.get('/company/risk', getCompanyRiskController)
router.get('/company/logo', searchCompanyLogoController)
router.patch(
  '/company/logo',
  updateCompanyLogoValidation,
  updateCompanyLogoController
)

router.delete('/company/logo', deleteCompanyLogoController)

export default router
