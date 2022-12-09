import { knex } from '../../../src/common/db'

import { MODEL_ERROR, NOT_FOUND } from '../../../src/common/constants'

import prismaClient from '../../../src/prismaClient'

/**
 *
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const uploadFilesModel = async (params: any) => {
  try {
    const { name, size, md5, mimetype } = params
    let uuid
    uuid = await knex.select('id').from('store').where({ md5 })
    if (uuid.length === 0) {
      [uuid] = await knex.transaction(async (tx: any) => {
        const uuid = (
          await tx('store')
            .returning('id')
            .insert({ md5, name, size, type: mimetype })
        ).map((e: any) => e.id)
        return uuid
      })
    }
    else { uuid = uuid[0].id }
    return { uuid }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 * @param {import('@prisma/client').company['id']} companyId
 * @param {import('@prisma/client').store['id']} storeId
 */
export const downloadFile = async (companyId: any, storeId: any) => {
  try {
    const data = await prismaClient.store.findFirst({
      select: {
        id: true,
        md5: true,
        name: true,
        size: true,
        type: true,
      },
      where: {
        AND: {
          OR: [
            {
              probe: {
                some: {
                  company_id: companyId,
                  store_id: storeId,
                },
              },
            },
            {
              revision: {
                some: {
                  asset_document: {
                    asset: {
                      company_id: companyId,
                    },
                  },
                  store_id: storeId,
                },
              },
            },
          ],
        },
        id: storeId,
      },
    })

    if (!data)
      return { error: NOT_FOUND }

    return { data }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
