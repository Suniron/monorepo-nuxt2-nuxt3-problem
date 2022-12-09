import express from 'express'
import {
  addCartographyElementController,
  createCartographyController,
  deleteCartographyController,
  deleteCartographyElementController,
  fetchCartographiesController,
  fetchCartographyElementsController,
  updateCartographyController,
  updateCartographyElementController,

} from '../../controllers/cartography'

const router = express.Router()

router.get('/cartographies', fetchCartographiesController)
router.post('/cartographies', createCartographyController)
router.patch('/cartographies/:cartoId', updateCartographyController)
router.get('/cartographies/:cartoId', fetchCartographyElementsController)
router.post('/cartographies/:cartoId/elements', addCartographyElementController)
router.patch(
  '/cartographies/:cartoId/elements/:eId',
  updateCartographyElementController,
)
router.delete(
  '/cartographies/:cartoId/elements/:eId',
  deleteCartographyElementController,
)
router.delete('/cartographies/:cartoId', deleteCartographyController)

export default router
