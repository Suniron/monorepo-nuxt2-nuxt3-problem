import { knex } from '../../../src/common/db'

import prismaClient from '../../../src/prismaClient'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
} from '../../../src/common/constants'
import type { LoggedUser } from '../../../types/user'

export const createRelationModel = async (params: any, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const { from_asset_id, to_asset_id, type, replace = false } = params
    const assets = [].concat(from_asset_id).concat(to_asset_id)
    const assetsExist = await knex
      .select('ast.id')
      .from('asset as ast')
      .innerJoin('company as cp', 'cp.id', 'ast.company_id')
      .where('cp.id', companyId)
      .whereIn('ast.id', assets)
    if (assetsExist.length !== assets.length)
      return { error: UNAUTHORIZED }
    let relId
    if (!replace) {
      relId = await knex.select('id').from('relation').where({
        from_asset_id,
        to_asset_id,
        type,
      })
      if (relId.length !== 1) {
        [relId] = (
          await knex.transaction((tx: any) => {
            const relationId = tx('relation').returning('id').insert({
              from_asset_id,
              to_asset_id,
              type,
            })
            return relationId
          })
        ).map((e: any) => e.id)
      }
      else {
        relId = relId[0].id
      }
    }
    else {
      // TODO: Find why it's unused
      // const ids = await knex
      //   .from('relation')
      //   .where({ to_asset_id: to_asset_id, type: type })
      //   .delete()
      const insert: any = []
      from_asset_id.forEach((elt: any) => {
        insert.push({
          from_asset_id: elt,
          to_asset_id,
          type,
        })
      })
      relId = (
        await knex.transaction((tx: any) => {
          const relationId = tx('relation').returning('id').insert(insert)
          return relationId
        })
      ).map((e: any) => e.id)
    }

    return { id: relId }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createBulkRelationModel = async (
  relations:
  {
    fromAssetId: number
    relationType: string
    toAssetId: number
  }[]
  ,
  loggedUserInfo: LoggedUser,
) => {
  try {
    const { companyId } = loggedUserInfo

    const relationsToInsert = relations.filter(
      r => r.fromAssetId !== r.toAssetId,
    )

    const assetIds = relationsToInsert.reduce(
      (acc: number[], { fromAssetId, toAssetId }: { fromAssetId: number; toAssetId: number }) => {
        acc.push(fromAssetId)
        acc.push(toAssetId)
        return acc
      },
      [],
    )

    const assetsInCompany = (
      await prismaClient.asset.findMany({
        select: {
          id: true,
          type: true,
        },
        where: {
          company_id: companyId,
          id: {
            in: assetIds,
          },
        },
      })
    )
    const assetIdsInCompany = assetsInCompany.map(aic => aic.id)

    const createRelationQueries = []
    relationsToInsert.forEach((relation) => {
      if (!assetIdsInCompany.includes(relation.fromAssetId) || !assetIdsInCompany.includes(relation.toAssetId))
        return

      // Etablish a relation between two assets
      createRelationQueries.push(
        prismaClient.relation.upsert({
          create: {
            from_asset_id: relation.fromAssetId,
            to_asset_id: relation.toAssetId,
            type: relation.relationType,
          },
          select: {
            from_asset_id: true,
            id: true,
            to_asset_id: true,
            type: true,
          },
          update: {},
          where: {
            type_from_asset_id_to_asset_id: {
              from_asset_id: relation.fromAssetId,
              to_asset_id: relation.toAssetId,
              type: relation.relationType,
            },
          },
        }),
      )
    })

    if (!createRelationQueries.length)
      return { ids: [] }

    const newRelationIds = await prismaClient.$transaction(createRelationQueries)

    // Only if we link a business unit to a business mission
    let fearedEventsIds: number[] = []
    const addFearedEventQueries = []
    // Search for couple of business unit and business mission to add feared events
    for (const relation of relations) {
      const fromAsset = assetsInCompany.find(r => r.id === relation.fromAssetId)
      const toAsset = assetsInCompany.find(r => r.id === relation.toAssetId)

      const newRelationId = newRelationIds.find(
        nri =>
          nri.from_asset_id === relation.fromAssetId

        && nri.to_asset_id === relation.toAssetId && nri.type === relation.relationType,
      )?.id

      if (!fromAsset || !toAsset || !newRelationId || !(fromAsset.type === 'UNIT' && toAsset.type === 'MISSION') || relation.relationType !== 'BELONGS_TO')
        continue

      // Init feared events ids if not already done
      if (!fearedEventsIds.length) {
        fearedEventsIds = await prismaClient.feared_event.findMany({
          select: {
            id: true,
          },
        }).then(fes => fes.map(fe => fe.id))
      }

      // Add feared events
      addFearedEventQueries.push(
        prismaClient.business_mission_unit_has_feared_event.createMany({
          data:
            fearedEventsIds.map(fei => ({
              business_mission_unit_id: newRelationId,
              feared_event_id: fei,
            })),
        }),
      )
    }

    if (addFearedEventQueries.length)
      await prismaClient.$transaction(addFearedEventQueries)

    return { ids: newRelationIds }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const updateRelationModel = async (id: any, params: any) => {
  try {
    const { type } = params
    const relId = await knex.transaction(async (tx: any) => {
      const [relationId] = (
        await tx('relation')
          .returning('id')
          .update({
            type,
          })
          .where('id', id)
      ).map((e: any) => e.id)
      return relationId
    })
    return { id: relId }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} id
 * @returns
 */
export const deleteRelationModel = async (id: any) => {
  // TODO: check permissions
  try {
    await knex('relation').where('id', id).delete()

    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {{fromAssetId: number, relationType: string, toAssetId: number}} params
 * @returns {Promise<{error?: string , count?: number}>}
 */
export const deleteRelationByAssetsIdsModel = async (params: any) => {
  // TODO: check permissions
  try {
    const { fromAssetId, relationType, toAssetId } = params
    // As the relation table does not have a uniqueness constraint on "from_asset_id" & "to_asset_id" columns, you can't use delete function but deleteMany instead
    const result = await prismaClient.relation.deleteMany({
      where: {
        from_asset_id: fromAssetId,
        to_asset_id: toAssetId,
        type: relationType,
      },
    })
    if (!result.count)
      return { error: NOT_FOUND }

    return result
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
