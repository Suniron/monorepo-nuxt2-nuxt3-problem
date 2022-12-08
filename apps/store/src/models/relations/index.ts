// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
} from '@/common/constants'

export const createRelationModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const { from_asset_id, to_asset_id, type, replace = false } = params
    const assets = [].concat(from_asset_id).concat(to_asset_id)
    const assetsExist = await knex
      .select('ast.id')
      .from('asset as ast')
      .innerJoin('company as cp', 'cp.id', 'ast.company_id')
      .where('cp.id', companyId)
      .whereIn('ast.id', assets)
    if (assetsExist.length !== assets.length) return { error: UNAUTHORIZED }
    let relId
    if (!replace) {
      relId = await knex.select('id').from('relation').where({
        from_asset_id: from_asset_id,
        to_asset_id: to_asset_id,
        type: type,
      })
      if (relId.length !== 1) {
        // eslint-disable-next-line prettier/prettier
        [relId] = (
          await knex.transaction((tx: any) => {
            const relationId = tx('relation').returning('id').insert({
              from_asset_id: from_asset_id,
              to_asset_id: to_asset_id,
              type: type,
            })
            return relationId
          })
        ).map((e: any) => e.id)
      } else relId = relId[0].id
    } else {
      // TODO: Find why it's unused
      // const ids = await knex
      //   .from('relation')
      //   .where({ to_asset_id: to_asset_id, type: type })
      //   .delete()
      const insert: any = []
      from_asset_id.forEach((elt: any) => {
        insert.push({
          to_asset_id: to_asset_id,
          type: type,
          from_asset_id: elt,
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
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {{fromAssetId: number, relationType: string, toAssetId: number}[]} params
 * @param {*} loggedUserInfo
 * @returns {Promise<{error?: undefined, ids: {id: number}[]} | {error: string, ids?: undefined}>}
 */
export const createBulkRelationModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo

    const relationsToInsert = params.filter(
      (relation: any) => relation.fromAssetId !== relation.toAssetId
    )

    const assets = relationsToInsert.reduce((
      /** @type {number[]} */ acc: any,
      {
        fromAssetId,
        toAssetId
      }: any
    ) => {
      acc.push(fromAssetId)
      acc.push(toAssetId)
      return acc
    }, [])

    const assetsIdsInCompany = (
      await prismaClient.asset.findMany({
        select: {
          id: true,
        },
        where: {
          id: {
            in: assets,
          },
          company_id: companyId,
        },
      })
    ).map((e: any) => e.id)

    const queries: any = []

    relationsToInsert.forEach((relation: any) => {
      if (
        assetsIdsInCompany.includes(relation.fromAssetId) &&
        assetsIdsInCompany.includes(relation.toAssetId)
      ) {
        queries.push(
          prismaClient.relation.upsert({
            select: {
              id: true,
            },
            where: {
              type_from_asset_id_to_asset_id: {
                from_asset_id: relation.fromAssetId,
                type: relation.relationType,
                to_asset_id: relation.toAssetId,
              },
            },
            update: {},
            create: {
              from_asset_id: relation.fromAssetId,
              to_asset_id: relation.toAssetId,
              type: relation.relationType,
            },
          })
        )
      }
    })

    if (queries.length > 0) {
      return { ids: await prismaClient.$transaction(queries) }
    }

    return { ids: [] }
  } catch (error) {
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
            type: type,
          })
          .where('id', id)
      ).map((e: any) => e.id)
      return relationId
    })
    return { id: relId }
  } catch (error) {
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
  } catch (error) {
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
    if (!result.count) {
      return { error: NOT_FOUND }
    }
    return result
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
