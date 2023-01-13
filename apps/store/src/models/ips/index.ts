import { knex } from '../../../src/common/db'

import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '../../../src/common/constants'

export const updateIpModel = async (ip: any, id: any) => {
  try {
    const [ipToUpdate] = await knex.select('id').from('ip').where('ip.id', id)
    if (!ipToUpdate)
      return { error: NOT_FOUND }
    await knex('ip')
      .update({
        address: ip.address,
        iface: ip.iface,
        mac: ip.mac,
        mask: ip.mask,
      })
      .where('ip.id', id)
    if (ip.isMain !== 'No' || ip.isMain !== false) {
      const [idServerToUpdate] = await knex.select('asset_server_id').from('ip').where('ip.id', id)
      await knex('ip')
        .update({
          is_main: false,
        })
        .where('ip.asset_server_id', idServerToUpdate.asset_server_id)

      await knex('ip')
        .update({
          is_main: true,
        })
        .where('ip.id', id)
    }
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createIpModel = async (assetId: any, params: any) => {
  try {
    const { address, mac, iface, mask } = params
    const [ipId] = await knex('ip').returning('id').insert({
      address,
      asset_server_id: assetId,
      iface,
      mac,
      mask,
    })
    return { ipId }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteIpModel = async (ipId: any) => {
  try {
    const [ipToUpdate] = await knex.select('id').from('ip').where('ip.id', ipId)
    if (!ipToUpdate)
      return { error: NOT_FOUND }

    await knex('ip').delete().where('ip.id', ipId)
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
