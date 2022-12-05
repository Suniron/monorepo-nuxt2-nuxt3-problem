import { knex } from '@/common/db'
import { MODEL_ERROR, SUCCESS } from '@/common/constants'

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

    return { cartographies: cartographies }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const fetchCartographyElementsModel = async (
  id,
  loggedUserInfo = {}
) => {
  try {
    const { companyId } = loggedUserInfo
    const elements = await knex
      .select({
        elementId: 'elt.id',
        group: 'elt.cygroup',
        assetId: 'elt.asset_id',
        relationId: 'elt.relation_id',
        cartographyId: 'elt.cartography_id',
        x: 'elt.x',
        y: 'elt.y',
        fromId: knex.raw('NULL'),
        toId: knex.raw('NULL'),
        parent: 'elt.parent',
        name: 'ast.name',
        type: 'ast.type',
        os: 'asrv.os',
        language: 'aweb.language',
      })
      .from('cartography_element as elt')
      .innerJoin('cartography as cart', 'cart.id', 'elt.cartography_id')
      .innerJoin('asset as ast', 'ast.id', 'elt.asset_id')
      .leftJoin('asset_server as asrv', 'asrv.id', 'ast.id')
      .leftJoin('asset_web as aweb', 'aweb.id', 'ast.id')
      .where({ 'cart.company_id': companyId, 'cart.id': id })
      .union(function () {
        this.select({
          elementId: 'elt.id',
          group: 'elt.cygroup',
          assetId: knex.raw('NULL'),
          relationId: 'elt.relation_id',
          cartographyId: 'elt.cartography_id',
          x: knex.raw('NULL'),
          y: knex.raw('NULL'),
          fromId: 'eltfrom.id',
          toId: 'eltto.id',
          parent: knex.raw('NULL'),
          name: knex.raw('NULL'),
          type: 'rel.type',
          os: knex.raw('NULL'),
          language: knex.raw('NULL'),
        })
          .from('cartography_element as elt')
          .innerJoin('cartography as cart', 'cart.id', 'elt.cartography_id')
          .innerJoin('relation as rel', 'rel.id', 'elt.relation_id')
          .innerJoin(
            'cartography_element as eltfrom',
            'eltfrom.asset_id',
            'rel.from_asset_id'
          )
          .innerJoin(
            'cartography_element as eltto',
            'eltto.asset_id',
            'rel.to_asset_id'
          )
          .where({
            'cart.company_id': companyId,
            'cart.id': id,
            'eltfrom.cartography_id': id,
            'eltto.cartography_id': id,
          })
      })
    return { elements: elements }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCartographyModel = async (
  id,
  params,
  loggedUserInfo = {}
) => {
  try {
    const { companyId } = loggedUserInfo
    const { name = null } = params
    await knex.transaction(async (tx) => {
      await tx('cartography')
        .update({
          name,
        })
        .where({ id: id, company_id: companyId })
    })
    return { status: SUCCESS }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const createCartographyModel = async (params, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    const { name = null } = params
    const cyId = await knex.transaction(async (tx) => {
      const [{ id }] = await tx('cartography').returning('id').insert({
        company_id: companyId,
        name,
      })
      return id
    })
    return cyId
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCartographyModel = async (id, loggedUserInfo = {}) => {
  try {
    const { companyId } = loggedUserInfo
    await knex('cartography').where({ id: id, company_id: companyId }).delete()
    await knex('cartography_element').where('cartography_id', id).delete()
    return { status: SUCCESS }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const deleteCartographyElementModel = async (id, eid) => {
  try {
    await knex('cartography_element')
      .where({ cartography_id: id, id: eid })
      .delete()
    return { status: SUCCESS }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const addCartographyElementModel = async (
  id,
  params,
  loggedUserInfo = {}
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
      .andWhere(function () {
        if (asset_id) this.where('cyelt.asset_id', asset_id)
        else this.where('cyelt.relation_id', relation_id)
      })
    let cid
    if (!elt) {
      cid = await knex.transaction(async (tx) => {
        const [ceId] = (
          await tx('cartography_element').returning('id').insert({
            cartography_id: id,
            asset_id,
            relation_id,
            cygroup,
            parent,
            x,
            y,
          })
        ).map((e) => e.id)
        return ceId
      })
    } else cid = elt.id
    return cid
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}

export const updateCartographyElementModel = async (id, eid, params) => {
  try {
    const { parent = null, x = null, y = null } = params
    const [eltToUpdate] = await knex
      .select()
      .from('cartography_element')
      .where({ cartography_id: id, id: eid })
    await knex.transaction(async (tx) => {
      await tx('cartography_element')
        .update({
          parent: parent === null ? eltToUpdate.parent : parent,
          x: x || eltToUpdate.x,
          y: y || eltToUpdate.y,
        })
        .where({ cartography_id: id, id: eid })
    })
    return { status: SUCCESS }
  } catch (error) {
    console.log(error)
    return { error: MODEL_ERROR }
  }
}
