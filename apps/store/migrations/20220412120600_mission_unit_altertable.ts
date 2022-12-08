exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('parent_child', async (table: any) => {
    table.increments('id').primary()
    table.integer('score')
  });
}

exports.down = (knex: any) => {
  return knex.schema.alterTable('parent_child', async (table: any) => {
    table.dropColumn('id')
    table.dropColumn('score')
  });
}
