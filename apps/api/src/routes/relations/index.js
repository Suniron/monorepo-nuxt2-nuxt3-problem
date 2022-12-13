import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createBulkRelationController,
  createRelationController,
  deleteRelationByAssetsIdsController,
  deleteRelationController,
  updateRelationController,
} from '@/controllers/relations'

const router = express.Router()

const deleteRelationByAssetsIdsValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    fromAssetId: Joi.number().required(),
    relationType: Joi.string().required(),
    toAssetId: Joi.number().required(),
  }),
})

router.post('/relations', createRelationController)
router.post('/relations/bulk', createBulkRelationController)
router.patch('/relations/:id', updateRelationController)
router.delete('/relations/:id', deleteRelationController)
router.delete(
  '/relations/:fromAssetId/:relationType/:toAssetId',
  deleteRelationByAssetsIdsValidation,
  deleteRelationByAssetsIdsController,
)

export default router
