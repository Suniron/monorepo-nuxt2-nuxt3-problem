// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await Promise.all([
    // Create the dashboard item
    knex.raw(`
      INSERT INTO public.dashboard_item (id,breakpoint,breakpointwidth,x,y,width,height,"name",prop,ckey) VALUES
        ('40','sm',168,0,70,12,8,'compliance-spider-graphs',NULL,'complianceSpiderGraphs'),
        ('41','md',996,0,16,7,4,'compliance-spider-graphs',NULL,'complianceSpiderGraphs'),
        ('42','lg',1200,0,14,5,4,'compliance-spider-graphs',NULL,'complianceSpiderGraphs');
      `),
  ])
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await Promise.all([
    knex.raw(`DELETE FROM dashboard_item WHERE id in (40, 41, 42)`),
  ])
}
