import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  VALIDATION_ERROR,
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
} from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/strings/colors' or it... Remove this comment to see the full error message
import { getRandomColor } from '@/common/strings/colors'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'

export const searchTagsModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // Query

    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const query = knex.select('id', 'name', 'color').from('tag').where({
      company_id: companyId,
    })
    const { id } = params
    if (id !== undefined) {
      query.where({ id })
    }

    const result = await query
    if (Array.isArray(result)) {
      if (id) {
        const [tag] = result
        if (tag) return { tag }
        else return { error: NOT_FOUND }
      }
      return { tags: result, total: result.length }
    }

    return { error: MODEL_ERROR }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
export const createTagModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const { name, color = getRandomColor() } = params

    if (typeof name !== 'string' || name.trim() === '')
      return { error: VALIDATION_ERROR }

    const trimmedName = name.trim()

    const duplicates = await prismaClient.tag.findMany({
      where: {
        name: trimmedName,
        company_id: companyId,
      },
    })

    if (duplicates.length > 0) return { error: 'DuplicateError' }

    const [{ id }] = await knex('tag')
      .insert({
        name,
        color,
        company_id: companyId,
      })
      .returning('id')

    if (id) return { id }

    return { error: MODEL_ERROR }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const updateTagModel = async (id: any, newTagData: any, loggedUserInfo = {}) => {
  try {
    if (!id) return { error: VALIDATION_ERROR }

    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo

    const tag = await prismaClient.tag.findMany({
      where: {
        id: Number(id),
        company_id: companyId,
      },
    })

    if (!tag.length) return { error: NOT_FOUND }

    await prismaClient.tag.update({
      where: {
        id: Number(id),
      },
      data: {
        color: newTagData.color,
        name: newTagData.name,
      },
    })

    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteTagModel = async (id: any, loggedUserInfo = {}) => {
  try {
    if (!id) return { error: VALIDATION_ERROR }

    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const [tagToDelete] = await knex('tag').where({
      id,
      company_id: companyId,
    })
    if (!tagToDelete) return { error: NOT_FOUND }

    await knex('tag').where('id', id).del()
    return { status: SUCCESS }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
