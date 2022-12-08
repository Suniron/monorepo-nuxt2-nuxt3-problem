exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable(
    'business_mission_unit_feared_event_has_business_impact',
    function (table: any) {
      table.increments('id').primary()
      table
        .integer('business_mission_unit_feared_event_id')
        .references('id')
        .inTable('public.business_mission_unit_has_feared_event')
        .onDelete('cascade')
      table
        .integer('id_business_impact')
        .references('id')
        .inTable('public.business_impact')
    }
  );
}

exports.down = (knex: any) => {
  return knex.schema.dropTable(
    'business_mission_unit_feared_event_has_business_impact '
  )
}
