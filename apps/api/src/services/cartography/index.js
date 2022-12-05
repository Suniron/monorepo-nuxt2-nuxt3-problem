import { cartographiesAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const fetchCartographiesService = async (accessToken = '') => {
  try {
    const cy = await cartographiesAPIs.fetchCartographies(accessToken)
    return cy
  } catch (error) {
    return createServiceError(error)
  }
}

export const fetchCartographyElementsService = async (id, accessToken = '') => {
  try {
    const formElts = (elt) => {
      const res = {
        group: elt.group,
        data: {
          id: elt.elementId,
          name: elt.name,
        },
      }
      if (elt.group === 'nodes') {
        res.data = {
          ...res.data,
          type:
            elt.os?.toLowerCase() ||
            elt.language?.toLowerCase() ||
            elt.type.toLowerCase(),
          parent: elt.parent,
          asset_id: elt.assetId,
        }
        res.position = {
          x: elt.x || undefined,
          y: elt.y || undefined,
        }
        res.classes =
          elt.os?.toLowerCase() ||
          elt.language?.toLowerCase() ||
          elt.type.toLowerCase()
      } else if (elt.group === 'edges') {
        res.data = {
          ...res.data,
          relation_id: elt.relationId,
          source: elt.fromId,
          target: elt.toId,
        }
        res.classes = elt.type
      }
      return res
    }
    const elts = await cartographiesAPIs.fetchCartographyElements(
      id,
      accessToken
    )
    return { elements: elts.elements.map(formElts) }
  } catch (error) {
    log.withError(error).error('fetchCartographyElementsService')
    return createServiceError(error)
  }
}

export const updateCartographyService = async (
  id,
  params,
  accessToken = ''
) => {
  try {
    return await cartographiesAPIs.updateCartography(id, params, accessToken)
  } catch (error) {
    return createServiceError(error)
  }
}

export const createCartographyService = async (params, accessToken = '') => {
  try {
    const id = await cartographiesAPIs.createCartography(params, accessToken)
    return id
  } catch (error) {
    return createServiceError(error)
  }
}

export const deleteCartographyService = async (id, accessToken = '') => {
  try {
    return await cartographiesAPIs.deleteCartography(id, accessToken)
  } catch (error) {
    return createServiceError(error)
  }
}

export const deleteCartographyElementService = async (
  id,
  eid,
  accessToken = ''
) => {
  try {
    return await cartographiesAPIs.deleteCartographyElement(
      id,
      eid,
      accessToken
    )
  } catch (error) {
    return createServiceError(error)
  }
}

export const addCartographyElementService = async (
  id,
  params,
  accessToken = ''
) => {
  try {
    const cid = await cartographiesAPIs.addCartographyElement(
      id,
      params,
      accessToken
    )
    return cid
  } catch (error) {
    return createServiceError(error)
  }
}

export const updateCartographyElementService = async (
  id,
  eid,
  params,
  accessToken = ''
) => {
  try {
    return await cartographiesAPIs.updateCartographyElement(
      id,
      eid,
      params,
      accessToken
    )
  } catch (error) {
    return createServiceError(error)
  }
}
