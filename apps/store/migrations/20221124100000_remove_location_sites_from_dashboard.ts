// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await Promise.all([
    // Remove location sites from dashboard:
    knex.raw(`DELETE FROM dashboard_item di WHERE name = 'location-sites';`),

    // Move compliance compliance widget to the location sites widget:
    knex.raw(`
    UPDATE dashboard_item
    SET y = 64
    WHERE name = 'compliance-spider-graphs'
    AND breakpoint = 'sm';
  `),
    knex.raw(`
    UPDATE dashboard_item
    SET y = 12
    WHERE name = 'compliance-spider-graphs'
    AND breakpoint = 'md';
    `),
    knex.raw(`
    UPDATE dashboard_item
    SET y = 10
    WHERE name = 'compliance-spider-graphs'
    AND breakpoint = 'lg';
    `),
  ])
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  await Promise.all([
    // Put back location sites in dashboard:
    knex.raw(`
  INSERT INTO public.dashboard_item (id,breakpoint,breakpointwidth,x,y,width,height,"name",prop,ckey) VALUES
  ('40','sm',168,0,64,12,6,'location-sites',NULL,'locationSites'),
  ('41','md',996,0,12,12,4,'location-sites',NULL,'locationSites'),
  ('42','lg',1200,0,10,12,4,'location-sites',NULL,'locationSites');
  `),

    // Put back default compliance position:
    knex.raw(`
  UPDATE dashboard_item
  SET y = 70
  WHERE name = 'compliance-spider-graphs'
  AND breakpoint = 'sm';
  `),
    knex.raw(`
  UPDATE dashboard_item
  SET y = 16
  WHERE name = 'compliance-spider-graphs'
  AND breakpoint = 'md';
  `),
    knex.raw(`
  UPDATE dashboard_item
  SET y = 14
  WHERE name = 'compliance-spider-graphs'
  AND breakpoint = 'lg';
  `),
  ])
}
