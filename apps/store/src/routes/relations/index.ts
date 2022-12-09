import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  createRelationController,
  createBulkRelationController,
  updateRelationController,
  deleteRelationController,
  deleteRelationByAssetsIdsController,

} from '../../controllers/relations'

const router = express.Router()

const createBulkRelationValidation = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      fromAssetId: Joi.number().required(),
      toAssetId: Joi.number().required(),
      relationType: Joi.string()
        .valid(
          'BELONGS_TO',
          'LOCATED_TO',
          'OWN_BY',
          'CONNECTED_TO',
          'MAINTAINED_BY'
        )
        .allow(null),
    })
  ),
})

const deleteRelationByAssetsIdsValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    fromAssetId: Joi.number().required(),
    toAssetId: Joi.number().required(),
    relationType: Joi.string().required(),
  }),
})

router.post('/relations', createRelationController)
router.post(
  '/relations/bulk',
  createBulkRelationValidation,
  createBulkRelationController
)
router.patch('/relations/:relId', updateRelationController)
router.delete('/relations/:relId', deleteRelationController)
router.delete(
  '/relations/:fromAssetId/:relationType/:toAssetId',
  deleteRelationByAssetsIdsValidation,
  deleteRelationByAssetsIdsController
)

export default router
