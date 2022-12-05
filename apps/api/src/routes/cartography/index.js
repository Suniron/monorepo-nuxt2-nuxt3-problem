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
} from '@/controllers/cartography'

const router = express.Router()

router.get('/cartographies', fetchCartographiesController)
router.post('/cartographies', createCartographyController)
router.patch('/cartographies/:id', updateCartographyController)
router.get('/cartographies/:id', fetchCartographyElementsController)
router.post('/cartographies/:id/elements', addCartographyElementController)
router.patch(
  '/cartographies/:id/elements/:eid',
  updateCartographyElementController
)
router.delete(
  '/cartographies/:id/elements/:eid',
  deleteCartographyElementController
)
router.delete('/cartographies/:id', deleteCartographyController)

export default router
