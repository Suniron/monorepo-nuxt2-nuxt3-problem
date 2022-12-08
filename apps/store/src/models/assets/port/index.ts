// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '@/common/constants'

export const updateOrCreatePortModel = async (tx: any, ipId: any, params: any) => {
  try {
    const [portExist] = await tx
      .select()
      .from('port')
      .where({
        'port.ip_id': ipId,
        'port.number': parseInt(params.number),
        'port.protocol': params.protocol,
      })
    let portId = -1
    if (!portExist) portId = await createPortModel(tx, ipId, params)
    else await updatePortModel(tx, portExist.id, params)
    return portId === -1 ? portExist.id : portId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createPortModel = async (tx: any, ipId: any, params: any) => {
  try {
    const {
      cpe_id = knex.raw('NULL'),
      number = 0,
      version = '',
      service = '',
      protocol = '',
      detail = '',
      status = 'open',
    } = params
    const [portId] = (
      await tx('port')
        .returning('id')
        .insert({
          ip_id: ipId,
          cpe_id,
          number: parseInt(number),
          version,
          service,
          protocol,
          detail,
          status,
        })
    ).map((e: any) => e.id)
    return portId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updatePortModel = async (tx: any, portId: any, params: any) => {
  try {
    const [portToUpdate] = await tx
      .select()
      .from('port')
      .where('port.id', portId)
    if (!portToUpdate) return { error: NOT_FOUND }

    const {
      cpe_id = portToUpdate.cpe_id,
      number = portToUpdate.number,
      version = portToUpdate.version,
      service = portToUpdate.service,
      protocol = portToUpdate.protocol,
      detail = portToUpdate.detail,
      status = portToUpdate.status,
    } = params
    await tx('port')
      .update({
        cpe_id,
        number,
        version,
        service,
        protocol,
        detail,
        status,
      })
      .where('port.id', portId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deletePortModel = async (tx: any, portId: any) => {
  try {
    const [portToUpdate] = await tx
      .select()
      .from('port')
      .where('port.id', portId)
    if (!portToUpdate) return { error: NOT_FOUND }

    await tx('port').delete().where('port.id', portId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const searchPortModel = async (tx: any, params: any) => {
  try {
    const { ipId, companyId } = params
    const query = tx
      .select(tx.raw('ip.address, port.*'))
      .from('port')
      .innerJoin('ip', 'ip.id', 'port.ip_id')
      .innerJoin('asset as ast', 'ast.id', 'ip.asset_server_id')
      .where('ast.company_id', companyId)
    if (ipId) {
      query.where('port.ip_id', ipId)
    }
    const ports = await query
    return ports
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
