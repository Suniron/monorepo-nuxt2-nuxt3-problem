// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await Promise.all([
    knex.raw(`UPDATE dashboard_item SET width=5 WHERE id=10`),
    knex.raw(`UPDATE dashboard_item SET x=10,width=2,height=3 WHERE id=11`),
    knex.raw(`UPDATE dashboard_item SET x=5,width=5 WHERE id=12`),
  ])
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await Promise.all([
    knex.raw(`UPDATE dashboard_item SET width=5 WHERE id=10`),
    knex.raw(`UPDATE dashboard_item SET x=5,width=5,height=2 WHERE id=11`),
    knex.raw(`UPDATE dashboard_item SET x=8,width=4 WHERE id=12`),
  ])
}
