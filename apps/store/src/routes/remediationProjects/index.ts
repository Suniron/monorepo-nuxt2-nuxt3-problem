import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'

import {
  createRemediationProjectsController,
  getRemediationProjectCommentsController,
  getRemediationProjectStatusHistoryController,
  getRemediationProjectsController,
  getRemediationProjectsScopeController,
  getRemediationProjectsSummaryController,
  updateRemediationProjectScopeController,
  updateRemediationProjectScopeItemController,
  updateRemediationProjectsController,
} from '../../controllers/remediationProjects'

const router = express.Router()

const getRemediationProjectByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
})

const createProjectValidation = celebrate({
  [Segments.BODY]: Joi.object({
    assignees: Joi.array().items(Joi.string().uuid()).required().min(1),
    description: Joi.string().allow(null, '').required(),
    due_date: Joi.string().isoDate().required(),
    name: Joi.string().required(),
    owner: Joi.string().uuid().required(),
    priority: Joi.number().integer().required(),
    project_scope: Joi.array().items(Joi.number().integer()).required().min(1),
    start_date: Joi.string().isoDate().optional(),
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

// All remediation projects
router.get(
  '/remediation-projects/summary',
  getRemediationProjectsSummaryController,
)

// Specific remediation project
router.get(
  '/remediation-projects/:id',
  getRemediationProjectByIdValidation,
  getRemediationProjectsController,
)
router.patch(
  '/remediation-projects/:id',
  getRemediationProjectByIdValidation,
  updateRemediationProjectsController,
)
router.post(
  '/remediation-projects',
  createProjectValidation,
  createRemediationProjectsController,
)
router.get(
  '/posts/remediation-project/:id',
  getRemediationProjectByIdValidation,
  getRemediationProjectCommentsController,
)

// Scope of a specific remediation project
router.get(
  '/remediation-projects/:id/scope',
  getRemediationProjectByIdValidation,
  getRemediationProjectsScopeController,
)
router.patch(
  '/remediation-projects/:id/scope',
  updateRemediationProjectScopeValidation,
  updateRemediationProjectScopeController,
)

// Specific scope of a specific remediation project
router.patch(
  '/remediation-projects/:id/scope/:scopeId',
  updateRemediationProjectScopeItemValidation,
  updateRemediationProjectScopeItemController,
)

// Status history of a specific remediation project
router.get(
  '/remediation-projects/:id/status-history',
  getRemediationProjectByIdValidation,
  getRemediationProjectStatusHistoryController,
)

export default router