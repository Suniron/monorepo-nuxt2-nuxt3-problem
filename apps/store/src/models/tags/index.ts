import {
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  VALIDATION_ERROR,

} from '../../../src/common/constants'

import { knex } from '../../../src/common/db'

import { getRandomColor } from '../../../src/common/strings/colors'

import prismaClient from '../../../src/prismaClient'

export const searchTagsModel = async (params: any, loggedUserInfo = {}) => {
  try {
    // Query


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
