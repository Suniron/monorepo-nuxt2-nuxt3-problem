exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.table('user', (table: any) => {
    table.string('reset_token')
    table.string('token_expires_at')
  });
}
exports.down = (knex: any) => {
  return knex.schema.table('user', (table: any) => {
    table.dropColumn('reset_token')
    table.dropColumn('token_expires_at')
  });
}
