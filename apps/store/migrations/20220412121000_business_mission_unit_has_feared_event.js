exports.up = (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable(
    'business_mission_unit_has_feared_event ',
    function (table) {
      table.increments('id').primary()
      table
        .integer('business_mission_unit_id ')
        .references('parent_child.id')
        .onDelete('cascade')
      table
        .integer('feared_event_id')
        .references('feared_event.id')
        .onDelete('cascade')
      table.integer('severity_id').references('severity.id')
    }
  )
}

exports.down = (knex) => {
  return knex.schema.dropTable('business_mission_unit_has_feared_event ')
}
