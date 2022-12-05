import {
  fetchCartographiesService,
  fetchCartographyElementsService,
  updateCartographyService,
  createCartographyService,
  deleteCartographyService,
  addCartographyElementService,
  updateCartographyElementService,
  deleteCartographyElementService,
} from '@/services/cartography'
import { throwHTTPError } from '@/common/errors'

export const fetchCartographiesController = async (req, res, next) => {
  try {
    const cy = await fetchCartographiesService(req.accessToken)
    if (cy.error) throwHTTPError(cy.error)
    res.send(cy)
  } catch (error) {
    next(error)
  }
}

export const fetchCartographyElementsController = async (req, res, next) => {
  try {
    const elts = await fetchCartographyElementsService(
      req.params.id,
      req.accessToken
    )
    res.send(elts)
  } catch (error) {
    next(error)
  }
}

export const updateCartographyController = async (req, res, next) => {
  try {
    const result = await updateCartographyService(
      req.params.id,
      req.body,
      req.accessToken
    )
    if (result?.error) throwHTTPError(result.error)
    res.send()
  } catch (error) {
    next(error)
  }
}

export const createCartographyController = async (req, res, next) => {
  try {
    const id = await createCartographyService(req.body, req.accessToken)
    if (id.error) throwHTTPError(id.error)
    res.send({ id: id })
  } catch (error) {
    next(error)
  }
}

export const deleteCartographyController = async (req, res, next) => {
  try {
    const result = await deleteCartographyService(
      req.params.id,
      req.accessToken
    )
    if (result?.error) throwHTTPError(result.error)
    res.send()
  } catch (error) {
    next(error)
  }
}

export const addCartographyElementController = async (req, res, next) => {
  try {
    const id = await addCartographyElementService(
      req.params.id,
      req.body,
      req.accessToken
    )
    if (id.error) throwHTTPError(id.error)
    res.send({ id: id })
  } catch (error) {
    next(error)
  }
}

export const updateCartographyElementController = async (req, res, next) => {
  try {
    const result = await updateCartographyElementService(
      req.params.id,
      req.params.eid,
      req.body,
      req.accessToken
    )
    if (result?.error) throwHTTPError(result.error)
    res.send()
  } catch (error) {
    next(error)
  }
}

export const deleteCartographyElementController = async (req, res, next) => {
  try {
    const result = await deleteCartographyElementService(
      req.params.id,
      req.params.eid,
      req.accessToken
    )
    if (result?.error) throwHTTPError(result.error)
    res.send()
  } catch (error) {
    next(error)
  }
}
