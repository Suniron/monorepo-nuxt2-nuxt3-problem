import express from 'express'
import {
  getRemediationProjectsSummaryController,
  getRemediationProjectsController,
  updateRemediationProjectsController,
  getRemediationProjectStatusHistoryController,
  getRemediationProjectsScopeController,
  updateRemediationProjectScopeController,
  updateRemediationProjectScopeItemController,
  getRemediationProjectComments,
  createRemediationProjectsController,
} from '@/controllers/remediationProjects'
import { celebrate, Segments, Joi } from 'celebrate'

const router = express.Router()

const getRemediationProjectByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
})

const updateRemediationProjectScopeValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    project_scope: Joi.array().items(Joi.number().integer()).required(),
  }),
})

const updateRemediationProjectScopeItemValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
    scopeId: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object({
    is_done: Joi.bool().allow(null, '').required(),
  }),
})

// Remediation Projects End Points
router.get(
  '/remediation-projects/summary',
  getRemediationProjectsSummaryController
)
router.get(
  '/remediation-projects/:id',
  getRemediationProjectByIdValidation,
  getRemediationProjectsController
)
router.patch(
  '/remediation-projects/:id',
  getRemediationProjectByIdValidation,
  updateRemediationProjectsController
)
router.get(
  '/remediation-projects/:id/status-history',
  getRemediationProjectByIdValidation,
  getRemediationProjectStatusHistoryController
)
router.get(
  '/posts/remediation-project/:id',
  getRemediationProjectByIdValidation,
  getRemediationProjectComments
)
router.post('/remediation-projects', createRemediationProjectsController)

// Scope of a specific remediation project
router.get(
  '/remediation-projects/:id/scope',
  getRemediationProjectByIdValidation,
  getRemediationProjectsScopeController
)
router.patch(
  '/remediation-projects/:id/scope',
  updateRemediationProjectScopeValidation,
  updateRemediationProjectScopeController
)
router.patch(
  '/remediation-projects/:id/scope/:scopeId',
  updateRemediationProjectScopeItemValidation,
  updateRemediationProjectScopeItemController
)
export default router
