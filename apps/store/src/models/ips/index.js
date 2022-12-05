import { knex } from '@/common/db'
import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '@/common/constants'

export const deleteIpModel = async (ipId) => {
  try {
    const [ipToUpdate] = await knex.select('id').from('ip').where('ip.id', ipId)
    if (!ipToUpdate) return { error: NOT_FOUND }

    await knex('ip').delete().where('ip.id', ipId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
export const updateIpModel = async (ip, id) => {
  try {
    const [ipToUpdate] = await knex.select('id').from('ip').where('ip.id', id)
    if (!ipToUpdate) return { error: NOT_FOUND }
    await knex('ip')
      .update({
        address: ip.address,
        mac: ip.mac,
        mask: ip.mask,
        iface: ip.iface,
      })
      .where('ip.id', id)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createIpModel = async (assetId, params) => {
  try {
    const { address, mac, iface, mask } = params
    const [ipId] = await knex('ip').returning('id').insert({
      asset_server_id: assetId,
      address,
      mac,
      iface,
      mask,
    })
    return { ipId: ipId }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
