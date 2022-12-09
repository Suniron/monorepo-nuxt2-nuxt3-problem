
import { knex } from '../../../common/db'

import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '../../../common/constants'

export const updateOrCreateUriModel = async (tx: any, assetId: any, params: any) => {
  try {
    const [uriExist] = await tx
      .select()
      .from('uri')
      .where({ 'uri.asset_web_id': assetId, 'uri.uri': params.address })
    let uriId = -1
    if (!uriExist) uriId = await createUriModel(tx, assetId, params)
    else await updateUriModel(tx, uriExist.id, params)
    return uriId === -1 ? uriExist.id : uriId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createUriModel = async (tx: any, assetId: any, params: any) => {
  try {
    const { address } = params
    const [uriId] = (
      await tx('uri').returning('id').insert({
        asset_web_id: assetId,
        uri: address,
      })
    ).map((e: any) => e.id)
    return uriId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateUriModel = async (tx: any, uriId: any, params: any) => {
  try {
    const [uriToUpdate] = await tx.select().from('uri').where('uri.id', uriId)
    if (!uriToUpdate) return { error: NOT_FOUND }

    const { address = uriToUpdate.address } = params
    await tx('uri')
      .update({
        uri: address,
      })
      .where('uri.id', uriId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteUriModel = async (tx: any, uriId: any) => {
  try {
    const [uriToUpdate] = await tx.select().from('uri').where('uri.id', uriId)
    if (!uriToUpdate) return { error: NOT_FOUND }

    await tx('uri').delete().where('uri.id', uriId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const searchUriModel = async (
  tx: any,
  search: any,
  companyId: any,
  strict = false,
  assetId = undefined
) => {
  try {
    const query = tx
      .select('uri.id as uri_id', 'ast.id as ast_id', 'uri')
      .from('uri')
      .innerJoin('asset as ast', 'ast.id', 'uri.asset_web_id')
      .where('ast.company_id', companyId)
    if (search) {
      query.where(function(this: any) {
        if (!strict) {
          this.where('uri', 'like', knex.raw('?', `%${search}%`))
        } else {
          this.where('uri', search)
        }
      })
    }
    if (assetId) {
      query.where('ast.id', assetId)
    }
    const uris = await query
    return uris
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
