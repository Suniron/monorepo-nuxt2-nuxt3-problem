import { relationsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const createRelationService = async (params, accessToken) => {
  try {
    const { error, id } = await relationsAPIs.createRelation(
      params,
      accessToken
    )
    if (error) return { error }
    return id
  } catch (error) {
    log.withError(error).error('createRelationService')
    createServiceError(error)
  }
}

export const createBulkRelationService = async (params, accessToken) => {
  try {
    const { error, data } = await relationsAPIs.createBulkRelation(
      params,
      accessToken
    )
    if (error) return { error }
    return data
  } catch (error) {
    log.withError(error).error('createBulkRelationService')
    createServiceError(error)
  }
}

export const updateRelationService = async (relId, params, accessToken) => {
  try {
    const { error, id } = await relationsAPIs.updateRelation(
      relId,
      params,
      accessToken
    )
    if (error) return { error }
    return id
  } catch (error) {
    log.withError(error).error('updateRelationService')
    createServiceError(error)
  }
}

export const deleteRelationService = async (id, accessToken) => {
  try {
    const { error, status } = await relationsAPIs.deleteRelation(
      id,
      accessToken
    )
    if (error) return { error }
    return status
  } catch (error) {
    log.withError(error).error('deleteRelationService')
    createServiceError(error)
  }
}

export const deleteRelationByAssetsIdsService = async (params, accessToken) => {
  try {
    const result = await relationsAPIs.deleteRelationByAssetsIds(
      params,
      accessToken
    )
    return result
  } catch (error) {
    log.withError(error).error('deleteRelationByAssetsIdsService')
    createServiceError(error)
  }
}
