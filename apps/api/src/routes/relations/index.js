import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  createRelationController,
  createBulkRelationController,
  updateRelationController,
  deleteRelationController,
  deleteRelationByAssetsIdsController,
} from '@/controllers/relations'

const router = express.Router()

const deleteRelationByAssetsIdsValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    fromAssetId: Joi.number().required(),
    toAssetId: Joi.number().required(),
    relationType: Joi.string().required(),
  }),
})

router.post('/relations', createRelationController)
router.post('/relations/bulk', createBulkRelationController)
router.patch('/relations/:id', updateRelationController)
router.delete('/relations/:id', deleteRelationController)
router.delete(
  '/relations/:fromAssetId/:relationType/:toAssetId',
  deleteRelationByAssetsIdsValidation,
  deleteRelationByAssetsIdsController
)

export default router
