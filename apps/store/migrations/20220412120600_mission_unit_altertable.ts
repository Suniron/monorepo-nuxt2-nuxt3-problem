exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('parent_child', async (table) => {
    table.increments('id').primary()
    table.integer('score')
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable('parent_child', async (table) => {
    table.dropColumn('id')
    table.dropColumn('score')
  })
}
