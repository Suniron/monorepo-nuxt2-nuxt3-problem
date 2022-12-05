exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('asset_mission', (table) => {
    table.dropForeign('id')

    table.foreign('id').references('asset.id').onDelete('CASCADE')
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable('asset_mission', (table) => {
    table.foreign('id').references('public.asset.id').onDelete('NO ACTION')
  })
}
