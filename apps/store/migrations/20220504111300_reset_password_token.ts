exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.table('user', (table) => {
    table.string('reset_token')
    table.string('token_expires_at')
  })
}
exports.down = (knex) => {
  return knex.schema.table('user', (table) => {
    table.dropColumn('reset_token')
    table.dropColumn('token_expires_at')
  })
}
