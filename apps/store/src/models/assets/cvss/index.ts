import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '@/common/constants'

export const createCvssModel = async (tx, params) => {
  try {
    const { code = '', score = 0, version = 0 } = params
    const [cvssId] = (
      await tx('cvss').returning('id').insert({
        code,
        score,
        version,
      })
    ).map((e) => e.id)
    return cvssId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCvssModel = async (tx, cvssId, params) => {
  try {
    const [cvssToUpdate] = await tx
      .select()
      .from('cvss')
      .where('cvss.id', cvssId)
    if (!cvssToUpdate) return { error: NOT_FOUND }
    const {
      code = cvssToUpdate.code,
      score = cvssToUpdate.score,
      version = cvssToUpdate.version,
      temporal_score = cvssToUpdate.temporal_score,
      temporal_vector = cvssToUpdate.temporal_vector,
      impactScore = cvssToUpdate.impactScore,
    } = params
    await tx('cvss')
      .update({
        code,
        score,
        version,
        temporal_score,
        temporal_vector,
        impactScore,
      })
      .where('cvss.id', cvssId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCvssModel = async (tx, cvssId) => {
  try {
    const [cvssToUpdate] = await tx
      .select()
      .from('cvss')
      .where('cvss.id', cvssId)
    if (!cvssToUpdate) return { error: NOT_FOUND }

    await tx('cvss').delete().where('cvss.id', cvssId)
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
