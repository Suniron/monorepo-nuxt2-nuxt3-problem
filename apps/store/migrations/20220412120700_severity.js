exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema
    .createTable('severity', function (table) {
      table.increments('id').primary()
      table.string('name')
    })
    .then(function () {
      return knex('severity').insert([
        { name: 'C1' },
        { name: 'C2' },
        { name: 'C3' },
        { name: 'C4' },
        { name: 'C5' },
      ])
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('severity')
}
