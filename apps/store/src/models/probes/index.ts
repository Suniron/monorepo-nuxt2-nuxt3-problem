import { knex } from '../../../src/common/db'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,

} from '../../../src/common/constants'

import prismaClient from '../../../src/prismaClient'

import { log } from '../../../src/lib/logger'
export const searchProbesModel = async (params: any, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const probes = await knex
      .select({
        address: 'probe.address',
        cdate: 'probe.cdate',
        exitIp: 'probe.exit_ip',
        gw: 'probe.gw',
        id: 'probe.id',
        info: 'probe.info',
        mac: 'probe.mac',
        mask: 'probe.mask',
        name: 'probe.name',
        status: 'probe.status',
        storeId: 'probe.store_id',
        type: 'probe.probe_type',
      })
      .from('probe')
      .where('probe.company_id', companyId)

    return { probes }
  }
  catch (error) {
    log.withError(error).error('searchProbesModel')
    return { error: MODEL_ERROR }
  }
}
/**
 * @param {{id: number}} params
 * @property {{ name: string }} body
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns {Promise<{status: string} | {error: string}>}
 */

export const updateProbeModel = async (params: any, body: any, loggedUserInfo: any) => {
  try {
    const id = parseInt(params.id)
    // You might need to modify in there if anyone can change the name of a probe
    if (!loggedUserInfo.roles.includes('admin'))
      return { error: UNAUTHORIZED }

    const probeExist = await prismaClient.probe.findFirst({
      where: {
        company_id: loggedUserInfo.companyId,
        id,
      },
    })

    if (!probeExist)
      return { error: NOT_FOUND }

    const updateValidation = await prismaClient.probe.update({
      data: {
        name: body.name,
      },
      where: {
        id,
      },
    })

    if (!updateValidation)
      return { error: MODEL_ERROR }

    return { status: SUCCESS }
  }
  catch (error) {
    return { error: MODEL_ERROR }
  }
}
