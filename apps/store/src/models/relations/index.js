// @ts-check
import { knex } from '@/common/db'
import prismaClient from '@/prismaClient'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
} from '@/common/constants'

export const createRelationModel = async (params, loggedUserInfo = {}) => {
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
          await knex.transaction((tx) => {
            const relationId = tx('relation').returning('id').insert({
              from_asset_id: from_asset_id,
              to_asset_id: to_asset_id,
              type: type,
            })
            return relationId
          })
        ).map((e) => e.id)
      } else relId = relId[0].id
    } else {
      // TODO: Find why it's unused
      // const ids = await knex
      //   .from('relation')
      //   .where({ to_asset_id: to_asset_id, type: type })
      //   .delete()
      const insert = []
      from_asset_id.forEach((elt) => {
        insert.push({
          to_asset_id: to_asset_id,
          type: type,
          from_asset_id: elt,
        })
      })
      relId = (
        await knex.transaction((tx) => {
          const relationId = tx('relation').returning('id').insert(insert)
          return relationId
        })
      ).map((e) => e.id)
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
export const createBulkRelationModel = async (params, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo

    const relationsToInsert = params.filter(
      (relation) => relation.fromAssetId !== relation.toAssetId
    )

    const assets = relationsToInsert.reduce((
      /** @type {number[]} */ acc,
      { fromAssetId, toAssetId }
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
    ).map((e) => e.id)

    /**
     * @type {import('@prisma/client').PrismaPromise<any>[]}
     */
    const queries = []

    relationsToInsert.forEach((relation) => {
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
 * @param {import('@/types/user').LoggedUser} _loggedUserInfo
 * @returns
 */
export const updateRelationModel = async (id, params, _loggedUserInfo) => {
  try {
    const { type } = params
    const relId = await knex.transaction(async (tx) => {
      const [relationId] = (
        await tx('relation')
          .returning('id')
          .update({
            type: type,
          })
          .where('id', id)
      ).map((e) => e.id)
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
 * @param {import('@/types/user').LoggedUser} _loggedUserInfo
 * @returns
 */
export const deleteRelationModel = async (id, _loggedUserInfo) => {
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
 * @param {import('@/types/user').LoggedUser} _loggedUserInfo
 * @returns {Promise<{error?: string , count?: number}>}
 */
export const deleteRelationByAssetsIdsModel = async (
  params,
  _loggedUserInfo
) => {
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
