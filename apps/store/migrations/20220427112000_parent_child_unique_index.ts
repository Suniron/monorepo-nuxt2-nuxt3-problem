exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('parent_child', (table: any) => {
    table.unique(['parent_id', 'child_id'], 'unique_index_parent_child')
  });
}

exports.down = (knex: any) => {
  return knex.schema.alterTable('parent_child', (table: any) => {
    table.foreign('id').references('public.asset.id').onDelete('NO ACTION')
  });
}
