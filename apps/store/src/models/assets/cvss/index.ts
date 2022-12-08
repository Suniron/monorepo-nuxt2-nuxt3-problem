// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, NOT_FOUND, SUCCESS } from '@/common/constants'

export const createCvssModel = async (tx: any, params: any) => {
  try {
    const { code = '', score = 0, version = 0 } = params
    const [cvssId] = (
      await tx('cvss').returning('id').insert({
        code,
        score,
        version,
      })
    ).map((e: any) => e.id)
    return cvssId
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCvssModel = async (tx: any, cvssId: any, params: any) => {
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

export const deleteCvssModel = async (tx: any, cvssId: any) => {
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
