exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('parent_child', function (table) {
    table.integer('child_id').references('id').inTable('public.asset')
    table.integer('parent_id').references('id').inTable('public.asset')
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('parent_child')
}
