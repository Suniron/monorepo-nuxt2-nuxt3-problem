// @ts-check
import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createCompanyController,
  deleteCompanyLogoController,
  getCompanyRiskController,
  searchCompanyController,
  searchCompanyLogoController,
  updateCompanyController,
  updateCompanyLogoController,
} from '@/controllers/companies'

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
router.patch('/company', updateCompanyController)
router.get('/company/risk', getCompanyRiskController)
router.get('/company/logo', searchCompanyLogoController)
router.patch(
  '/company/logo',
  updateCompanyLogoValidation,
  updateCompanyLogoController,
)
router.delete('/company/logo', deleteCompanyLogoController)

router.get('/companies', searchCompanyController)
router.get('/companies/:cid', searchCompanyController)
router.post('/companies', createCompanyValidation, createCompanyController)

export default router
