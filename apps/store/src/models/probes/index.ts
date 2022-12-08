// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
} from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'
export const searchProbesModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const probes = await knex
      .select({
        id: 'probe.id',
        name: 'probe.name',
        cdate: 'probe.cdate',
        type: 'probe.probe_type',
        status: 'probe.status',
        address: 'probe.address',
        mask: 'probe.mask',
        mac: 'probe.mac',
        info: 'probe.info',
        exitIp: 'probe.exit_ip',
        gw: 'probe.gw',
        storeId: 'probe.store_id',
      })
      .from('probe')
      .where('probe.company_id', companyId)

    return { probes }
  } catch (error) {
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
    if (!loggedUserInfo.roles.includes('admin')) {
      return { error: UNAUTHORIZED }
    }

    const probeExist = await prismaClient.probe.findFirst({
      where: {
        id,
        company_id: loggedUserInfo.companyId,
      },
    })

    if (!probeExist) {
      return { error: NOT_FOUND }
    }

    const updateValidation = await prismaClient.probe.update({
      data: {
        name: body.name,
      },
      where: {
        id,
      },
    })

    if (!updateValidation) {
      return { error: MODEL_ERROR }
    }
    return { status: SUCCESS }
  } catch (error) {
    return { error: MODEL_ERROR }
  }
}
