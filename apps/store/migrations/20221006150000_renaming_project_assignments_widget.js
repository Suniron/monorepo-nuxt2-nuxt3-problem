// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    `UPDATE dashboard_item SET name = 'project-assignment' WHERE name = 'task-assignment';`
  )
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(
    `UPDATE dashboard_item SET name = 'task-assignment' WHERE name = 'project-assignment';`
  )
}
