import express from 'express'
import {
  fetchCartographiesController,
  fetchCartographyElementsController,
  updateCartographyController,
  createCartographyController,
  deleteCartographyController,
  addCartographyElementController,
  updateCartographyElementController,
  deleteCartographyElementController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/cartography' or ... Remove this comment to see the full error message
} from '@/controllers/cartography'

const router = express.Router()

router.get('/cartographies', fetchCartographiesController)
router.post('/cartographies', createCartographyController)
router.patch('/cartographies/:cartoId', updateCartographyController)
router.get('/cartographies/:cartoId', fetchCartographyElementsController)
router.post('/cartographies/:cartoId/elements', addCartographyElementController)
router.patch(
  '/cartographies/:cartoId/elements/:eId',
  updateCartographyElementController
)
router.delete(
  '/cartographies/:cartoId/elements/:eId',
  deleteCartographyElementController
)
router.delete('/cartographies/:cartoId', deleteCartographyController)

export default router
