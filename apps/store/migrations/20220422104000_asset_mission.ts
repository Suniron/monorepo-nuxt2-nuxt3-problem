exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('asset_mission', function (table) {
    table.integer('id').references('id').inTable('public.asset')
    table.date('last_update_date')
    table.integer('version')
  })
}
exports.down = (knex) => {
  return knex.schema.dropTable('asset_mission')
}
