
import { knex } from '../../../common/db'

import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '../../../common/constants'

export const updateOrCreateIpModel = async (tx: any, assetId: any, params: any) => {
  try {
    const [ipExist] = await tx
      .select()
      .from('ip')
      .where({ 'ip.asset_server_id': assetId, 'ip.address': params.address })
    let ipId = -1
    if (!ipExist) ipId = await createIpModel(tx, assetId, params)
    else await updateIpModel(tx, ipExist.id, params)
    return ipId === -1 ? ipExist.id : ipId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createIpModel = async (tx: any, assetId: any, params: any) => {
  try {
    const { address, mac = '', iface = '', mask = '' } = params
    const [ipId] = (
      await tx('ip').returning('id').insert({
        asset_server_id: assetId,
        address,
        mac,
        iface,
        mask,
      })
    ).map((e: any) => e.id)
    return ipId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateIpModel = async (tx: any, ipId: any, params: any) => {
  try {
    const [ipToUpdate] = await tx.select().from('ip').where('ip.id', ipId)
    if (!ipToUpdate) return { error: NOT_FOUND }

    const {
      address = ipToUpdate.address,
      mac = ipToUpdate.mac,
      iface = ipToUpdate.iface,
      mask = ipToUpdate.mask,
    } = params
    await tx('ip')
      .update({
        address,
        mac,
        iface,
        mask,
      })
      .where('ip.id', ipId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteIpModel = async (tx: any, ipId: any) => {
  try {
    const [ipToUpdate] = await tx.select().from('ip').where('ip.id', ipId)
    if (!ipToUpdate) return { error: NOT_FOUND }

    await tx('ip').delete().where('ip.id', ipId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const searchIpModel = async (
  tx: any,
  search: any,
  companyId: any,
  strict = false,
  assetId = undefined
) => {
  try {
    const query = tx
      .select('ip.id as ip_id', 'ast.id as ast_id', 'address')
      .from('ip')
      .innerJoin('asset as ast', 'ast.id', 'ip.asset_server_id')
      .where('ast.company_id', companyId)
    if (search) {
      query.where(function(this: any) {
        if (!strict) {
          this.where('address', 'like', knex.raw('?', `%${search}%`))
            .orWhere('mac', 'like', knex.raw('?', `%${search}%`))
            .orWhere('iface', 'like', knex.raw('?', `%${search}%`))
            .orWhere('mask', 'like', knex.raw('?', `%${search}%`))
        } else {
          this.where('address', search)
            .orWhere('mac', search)
            .orWhere('iface', search)
            .orWhere('mask', search)
        }
      })
    }
    if (assetId) {
      query.where('ast.id', assetId)
    }
    const ips = await query
    return ips
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
