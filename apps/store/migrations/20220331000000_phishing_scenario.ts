exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('phishing_scenario', function (table: any) {
    table.increments('id').unsigned().primary()
    table.string('name', 255).notNullable()
    table.text('description').nullable()
    table.tinyint('severity').notNullable()
  });
}

exports.down = (knex: any) => {
  return knex.schema.dropTable('phishing_scenario')
}
