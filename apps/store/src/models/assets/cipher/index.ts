import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '../../../common/constants'

export const createCipherModel = async (tx: any, portId: any, params: any) => {
  try {
    const { strength = '', tls = '', names = [] } = params
    const [cipherId] = (
      await tx('cipher_suite').returning('id').insert({
        names,
        port_id: portId,
        strength,
        tls,
      })
    ).map((e: any) => e.id)

    return cipherId
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCipherModel = async (
  tx: any,
  cipherId: any,
  params: any,
) => {
  try {
    const [cipherToUpdate] = await tx
      .select()
      .from('cipher_suite as cipher')
      .where('cipher.id', cipherId)
    if (!cipherToUpdate)
      return { error: NOT_FOUND }
    const {
      strength = cipherToUpdate.strength,
      tls = cipherToUpdate.tls,
      names = cipherToUpdate.names,
    } = params
    await tx('cipher_suite')
      .update({
        names,
        strength,
        tls,
      })
      .where('cipher_suite.id', cipherId)
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCipherModel = async (tx: any, cipherId: any) => {
  try {
    const [cipherToUpdate] = await tx
      .select()
      .from('cipher_suite')
      .where('cipher_suite.id', cipherId)
    if (!cipherToUpdate)
      return { error: NOT_FOUND }

    await tx('cipher_suite').delete().where('cipher_suite.id', cipherId)
    return { status: SUCCESS }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
