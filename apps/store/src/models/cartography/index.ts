import { knex } from '../../../src/common/db'

import { MODEL_ERROR, SUCCESS } from '../../../src/common/constants'

export const fetchCartographiesModel = async (loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const cartographies = await knex
      .select({
        id: 'cy.id',
        name: 'cy.name',
      })
      .from('cartography as cy')
      .where('cy.company_id', companyId)

    return { cartographies }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const fetchCartographyElementsModel = async (
  id: any,
  loggedUserInfo = {},
) => {
  try {
    const { companyId } = loggedUserInfo
    const elements = await knex
      .select({
        assetId: 'elt.asset_id',
        cartographyId: 'elt.cartography_id',
        elementId: 'elt.id',
        fromId: knex.raw('NULL'),
        group: 'elt.cygroup',
        language: 'aweb.language',
        name: 'ast.name',
        os: 'asrv.os',
        parent: 'elt.parent',
        relationId: 'elt.relation_id',
        toId: knex.raw('NULL'),
        type: 'ast.type',
        x: 'elt.x',
        y: 'elt.y',
      })
      .from('cartography_element as elt')
      .innerJoin('cartography as cart', 'cart.id', 'elt.cartography_id')
      .innerJoin('asset as ast', 'ast.id', 'elt.asset_id')
      .leftJoin('asset_server as asrv', 'asrv.id', 'ast.id')
      .leftJoin('asset_web as aweb', 'aweb.id', 'ast.id')
      .where({ 'cart.company_id': companyId, 'cart.id': id })
      .union(function (this: any) {
        this.select({
          assetId: knex.raw('NULL'),
          cartographyId: 'elt.cartography_id',
          elementId: 'elt.id',
          fromId: 'eltfrom.id',
          group: 'elt.cygroup',
          language: knex.raw('NULL'),
          name: knex.raw('NULL'),
          os: knex.raw('NULL'),
          parent: knex.raw('NULL'),
          relationId: 'elt.relation_id',
          toId: 'eltto.id',
          type: 'rel.type',
          x: knex.raw('NULL'),
          y: knex.raw('NULL'),
        })
          .from('cartography_element as elt')
          .innerJoin('cartography as cart', 'cart.id', 'elt.cartography_id')
          .innerJoin('relation as rel', 'rel.id', 'elt.relation_id')
          .innerJoin(
            'cartography_element as eltfrom',
            'eltfrom.asset_id',
            'rel.from_asset_id',
          )
          .innerJoin(
            'cartography_element as eltto',
            'eltto.asset_id',
            'rel.to_asset_id',
          )
          .where({
            'cart.company_id': companyId,
            'cart.id': id,
            'eltfrom.cartography_id': id,
            'eltto.cartography_id': id,
          })
      })
    return { elements }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCartographyModel = async (
  id: any,
  params: any,
  loggedUserInfo = {},
) => {
  try {
    const { companyId } = loggedUserInfo
    const { name = null } = params
    await knex.transaction(async (tx: any) => {
      await tx('cartography')
        .update({
          name,
        })
        .where({ company_id: companyId, id })
    })
    return { status: SUCCESS }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const createCartographyModel = async (params: any, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const { name = null } = params
    const cyId = await knex.transaction(async (tx: any) => {
      const [{ id }] = await tx('cartography').returning('id').insert({
        company_id: companyId,
        name,
      })
      return id
    })
    return cyId
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCartographyModel = async (id: any, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    await knex('cartography').where({ company_id: companyId, id }).delete()
    await knex('cartography_element').where('cartography_id', id).delete()
    return { status: SUCCESS }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCartographyElementModel = async (id: any, eid: any) => {
  try {
    await knex('cartography_element')
      .where({ cartography_id: id, id: eid })
      .delete()
    return { status: SUCCESS }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const addCartographyElementModel = async (
  id: any,
  params: any,
  loggedUserInfo = {},
) => {
  try {
    const { companyId } = loggedUserInfo
    const {
      asset_id = null,
      relation_id = null,
      cygroup = null,
      parent = null,
      x = 0,
      y = 0,
    } = params
    const [elt] = await knex
      .select('cyelt.id')
      .from('cartography_element as cyelt')
      .innerJoin('cartography as cy', 'cy.id', 'cyelt.cartography_id')
      .where('cy.company_id', companyId)
      .andWhere('cy.id', id)
      .andWhere(function (this: any) {
        if (asset_id)
          this.where('cyelt.asset_id', asset_id)
        else this.where('cyelt.relation_id', relation_id)
      })
    let cid
    if (!elt) {
      cid = await knex.transaction(async (tx: any) => {
        const [ceId] = (
          await tx('cartography_element').returning('id').insert({
            asset_id,
            cartography_id: id,
            cygroup,
            parent,
            relation_id,
            x,
            y,
          })
        ).map((e: any) => e.id)
        return ceId
      })
    }
    else { cid = elt.id }
    return cid
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCartographyElementModel = async (id: any, eid: any, params: any) => {
  try {
    const { parent = null, x = null, y = null } = params
    const [eltToUpdate] = await knex
      .select()
      .from('cartography_element')
      .where({ cartography_id: id, id: eid })
    await knex.transaction(async (tx: any) => {
      await tx('cartography_element')
        .update({
          parent: parent === null ? eltToUpdate.parent : parent,
          x: x || eltToUpdate.x,
          y: y || eltToUpdate.y,
        })
        .where({ cartography_id: id, id: eid })
    })
    return { status: SUCCESS }
  }
  catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}
