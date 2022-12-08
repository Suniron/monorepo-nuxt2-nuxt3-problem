exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('asset_mission', function (table: any) {
    table.integer('id').references('id').inTable('public.asset')
    table.date('last_update_date')
    table.integer('version')
  });
}
exports.down = (knex: any) => {
  return knex.schema.dropTable('asset_mission')
}
