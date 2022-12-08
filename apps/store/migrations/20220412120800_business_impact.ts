exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema
    .createTable('business_impact', function (table: any) {
      table.increments('id').primary()
      table.string('business_impact_name')
    })
    .then(function () {
      return knex('business_impact').insert([
        { business_impact_name: 'Organizations Service' },
        { business_impact_name: 'Health & Safety' },
        { business_impact_name: 'Facilities & Equipment' },
        { business_impact_name: 'Ecological' },
        { business_impact_name: 'Governance & Decision' },
        { business_impact_name: 'Employe Social Link' },
        { business_impact_name: 'Intellectual Property' },
        { business_impact_name: 'Financial' },
        { business_impact_name: 'Legal' },
        { business_impact_name: 'Trust & Image' },
      ])
    });
}

exports.down = (knex: any) => {
  return knex.schema.dropTable('business_impact')
}
