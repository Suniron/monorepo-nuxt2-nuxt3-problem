exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('parent_child', (table) => {
    table.unique(['parent_id', 'child_id'], 'unique_index_parent_child')
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable('parent_child', (table) => {
    table.foreign('id').references('public.asset.id').onDelete('NO ACTION')
  })
}
