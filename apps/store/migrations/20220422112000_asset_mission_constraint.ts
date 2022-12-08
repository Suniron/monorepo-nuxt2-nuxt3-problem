exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('asset_mission', (table: any) => {
    table.dropForeign('id')

    table.foreign('id').references('asset.id').onDelete('CASCADE')
  });
}

exports.down = (knex: any) => {
  return knex.schema.alterTable('asset_mission', (table: any) => {
    table.foreign('id').references('public.asset.id').onDelete('NO ACTION')
  });
}
