exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('parent_child', (table) => {
    table.dropForeign('parent_id')

    table.foreign('parent_id').references('asset.id').onDelete('CASCADE')

    table.dropForeign('child_id')

    table.foreign('child_id').references('asset.id').onDelete('CASCADE')
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable('parent_child', (table) => {
    table
      .foreign('parent_id')
      .references('public.asset.id')
      .onDelete('NO ACTION')

    table
      .foreign('child_id')
      .references('public.asset.id')
      .onDelete('NO ACTION')
  })
}
