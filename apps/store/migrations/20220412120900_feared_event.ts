exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema
    .createTable('feared_event', function (table) {
      table.increments('id').primary()
      table.string('name')
    })
    .then(function () {
      return knex('feared_event').insert([
        { name: 'Availability' },
        { name: 'Integrity' },
        { name: 'Confidentiality' },
        { name: 'Traceability' },
        { name: 'Performance' },
      ])
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('feared_event')
}
