import { knex } from '../../../src/common/db'

import { MODEL_ERROR, SUCCESS } from '../../../src/common/constants'

/**
 *
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const searchMissionAnalysis = async (params: any) => {
  try {
    const { id } = params
    const unitsSubQueryTest = knex
      .select(
        'ass.id',
        'ass.name',
        knex.raw(
          'array_agg(json_build_object(\'id\', ac.id, \'name\', asstt.name, \'unitId\', asstt.id)) as units',
        ),
      )
      .from('asset as ass')
      .groupBy('ass.id')
      .leftJoin('v_asset_child as ac', 'ass.id', 'ac.parent_id')
      .leftJoin('asset as asstt', 'ac.child_id', 'asstt.id')
      .as('agg_mission')
    const unitJoinParamsTest = [unitsSubQueryTest, 'agg_mission.id', 'ast.id']
    const [mission] = await knex
      .select({
        id: 'ast.id',
        name: 'ast.name',
        type: 'ast.type',
        units: knex.raw('coalesce(agg_mission.units, \'{}\')'),
      })
      .from({ ast: 'asset' })
      .where({ 'ast.id': id })
      .leftJoin(...unitJoinParamsTest)
    mission.units = mission.units.filter((unit: any) => unit.id !== null)
    for (const unit of mission.units) {
      unit.fearedEvents = await knex
        .select({
          id: 'bmuhfe.id',
          name: 'feared.name',
          severity: 'sever.name',
        })
        .from({ bmuhfe: 'business_mission_unit_has_feared_event' })
        .where({ 'bmuhfe.business_mission_unit_id': unit.id })
        .leftJoin(
          { feared: 'feared_event' },
          { 'feared.id': 'bmuhfe.feared_event_id' },
        )
        .leftJoin({ sever: 'severity' }, { 'sever.id': 'bmuhfe.severity_id' })
      for (const event of unit.fearedEvents) {
        event.businessImpact = await knex
          .select({
            id: 'buim.id',
            name: 'buim.business_impact_name',
          })
          .from({
            bibum: 'business_mission_unit_feared_event_has_business_impact',
          })
          .where({ 'bibum.business_mission_unit_feared_event_id': event.id })
          .leftJoin(
            { buim: 'business_impact' },
            { 'buim.id': 'bibum.id_business_impact' },
          )
      }
    }
    return { mission }
  }
  catch (error) {
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const searchBusinessImpact = async () => {
  try {
    const businessImpact = await knex
      .select({
        id: 'bi.id',
        name: 'bi.business_impact_name',
      })
      .from({ bi: 'business_impact' })

    return { businessImpact }
  }
  catch (error) {
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} businessImpactLinkedIntoUnit
 * @param {import('@/types/user').LoggedUser} params
 * @returns
 */
export const updateBusinessImpactIntoUnitModel = async (
  businessImpactLinkedIntoUnit: any,
  params: any,
) => {
  try {
    const { fearedEventId } = params
    await knex('business_mission_unit_feared_event_has_business_impact')
      .where('business_mission_unit_feared_event_id', Number(fearedEventId))
      .delete()
    for (const businessImpactId of businessImpactLinkedIntoUnit) {
      await knex(
        'business_mission_unit_feared_event_has_business_impact',
      ).insert({
        business_mission_unit_feared_event_id: Number(fearedEventId),
        id_business_impact: businessImpactId,
      })
    }
    return { status: SUCCESS }
  }
  catch (error) {
    return { error: MODEL_ERROR }
  }
}
