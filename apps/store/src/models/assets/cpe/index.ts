import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '../../../common/constants'

export const createCpeModel = async (tx: any, params: any) => {
  try {
    const {
      cpe,
      type,
      vendor = '',
      product = '',
      version = '',
      update = '',
      edition = '',
      language = '',
    } = params
    const [cpeId] = (
      await tx('cpe').returning('id').insert({
        cpe,
        edition,
        language,
        product,
        type,
        update,
        vendor,
        version,
      })
    ).map((e: any) => e.id)
    return cpeId
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCpeModel = async (tx: any, cpeId: any, params: any) => {
  try {
    const [cpeToUpdate] = await tx.select().from('cpe').where('cpe.id', cpeId)
    if (!cpeToUpdate)
      return { error: NOT_FOUND }

    const {
      cpe = cpeToUpdate.cpe,
      type = cpeToUpdate.type,
      vendor = cpe.cpeToUpdate,
      product = cpeToUpdate.product,
      version = cpeToUpdate.version,
      update = cpeToUpdate.update,
      edition = cpeToUpdate.edition,
      language = cpeToUpdate.language,
    } = params

    await tx('cpe')
      .update({
        cpe,
        edition,
        language,
        product,
        type,
        update,
        vendor,
        version,
      })
      .where('cpe.id', cpeId)
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateOrCreateCpeModel = async (
  tx: any,
  ids: any,
  params: any,
) => {
  try {
    const { assetId = -1, portId = -1 } = ids
    const [cpeExist] = await tx
      .select()
      .from('cpe')
      .leftJoin('cpe_asset as cast', 'cast.cpe_id', 'cpe.id')
      .leftJoin('port', 'port.cpe_id', 'cpe.id')
      .where('cpe', params.cpe)
      .andWhere(function (this: any) {
        this.where('cast.asset_id', assetId).orWhere('port.id', portId)
      })
    let cpeId = -1
    if (!cpeExist)
      cpeId = await createCpeModel(tx, params)
    else await updateCpeModel(tx, cpeExist.id, params)
    return cpeId === -1 ? cpeExist.id : cpeId
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCpeModel = async (tx: any, cpeId: any) => {
  try {
    const [cpeToUpdate] = await tx.select().from('cpe').where('cpe.id', cpeId)
    if (!cpeToUpdate)
      return { error: NOT_FOUND }

    await tx('cpe').delete().where('cpe.id', cpeId)
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
