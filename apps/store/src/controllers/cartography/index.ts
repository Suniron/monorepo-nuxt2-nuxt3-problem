// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError } from '@/common/errors'
import {
  fetchCartographiesModel,
  fetchCartographyElementsModel,
  updateCartographyModel,
  createCartographyModel,
  deleteCartographyModel,
  addCartographyElementModel,
  updateCartographyElementModel,
  deleteCartographyElementModel,
// @ts-expect-error TS(2307): Cannot find module '@/models/cartography' or its c... Remove this comment to see the full error message
} from '@/models/cartography'

export const fetchCartographiesController = async (req: any, res: any, next: any) => {
  try {
    const { cartographies } = await fetchCartographiesModel(req.user)
    res.send({ cartographies: cartographies })
  } catch (error) {
    next(error)
  }
}

export const fetchCartographyElementsController = async (req: any, res: any, next: any) => {
  try {
    const { elements } = await fetchCartographyElementsModel(
      req.params.cartoId,
      req.user
    )
    res.send({ elements: elements })
  } catch (error) {
    next(error)
  }
}

export const updateCartographyController = async (req: any, res: any, next: any) => {
  try {
    await updateCartographyModel(req.params.cartoId, req.body, req.user)
    res.send()
  } catch (error) {
    next(error)
  }
}

export const createCartographyController = async (req: any, res: any, next: any) => {
  try {
    const id = await createCartographyModel(req.body, req.user)
    if (id.error) throwHTTPError(id.error)
    res.send({ id: id })
  } catch (error) {
    next(error)
  }
}

export const deleteCartographyController = async (req: any, res: any, next: any) => {
  try {
    await deleteCartographyModel(req.params.cartoId, req.user)
    res.send()
  } catch (error) {
    next(error)
  }
}

export const addCartographyElementController = async (req: any, res: any, next: any) => {
  try {
    const id = await addCartographyElementModel(
      req.params.cartoId,
      req.body,
      req.user
    )
    if (id.error) throwHTTPError(id.error)
    res.send({ id: id })
  } catch (error) {
    next(error)
  }
}

export const updateCartographyElementController = async (req: any, res: any, next: any) => {
  try {
    await updateCartographyElementModel(
      req.params.cartoId,
      req.params.eId,
      req.body,
      req.user
    )
    res.send()
  } catch (error) {
    next(error)
  }
}

export const deleteCartographyElementController = async (req: any, res: any, next: any) => {
  try {
    await deleteCartographyElementModel(
      req.params.cartoId,
      req.params.eId,
      req.user
    )
    res.send()
  } catch (error) {
    next(error)
  }
}
