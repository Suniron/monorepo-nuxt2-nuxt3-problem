
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await Promise.all([
    knex.raw(`UPDATE dashboard_item SET x=8,width=4 WHERE id=14`),
    knex.raw(`UPDATE dashboard_item SET y=6 WHERE id=16`),
    knex.raw(`UPDATE dashboard_item SET y=7 WHERE id=17`),
    knex.raw(`UPDATE dashboard_item SET y=10 WHERE id=18`),
    knex.raw(`
    INSERT INTO public.dashboard_item (id,breakpoint,breakpointwidth,x,y,width,height,"name",prop,ckey) VALUES
      ('37','md',996,6,0,6,3,'assets-count',NULL,'assets-count'),
      ('38','sm',168,0,8,12,8,'assets-count',NULL,'assets-count'),
      ('39','lg',1200,6,3,2,2,'assets-count',NULL,'assets-count');
    `),
  ])

  await knex.raw(`
    INSERT INTO dashboard_user (user_id, dashboard_item_id, x, y, width, height, visible)
      SELECT u.id, 39, 0, GREATEST(MAX(du.y + du.height), MAX(di.y + di.height)), 2, 2, TRUE
      FROM dashboard_item di, "user" u
      LEFT JOIN dashboard_user du ON du.user_id = u.id 
      WHERE di.breakpoint = 'lg'
      AND NOT EXISTS (SELECT user_id, dashboard_item_id FROM dashboard_user du2 WHERE du2.user_id = du.user_id AND du2.dashboard_item_id = 39)
      GROUP BY u.id;
  `)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await Promise.all([
    knex.raw(`UPDATE dashboard_item SET x=6,width=6 WHERE id=14`),
    knex.raw(`UPDATE dashboard_item SET y=8 WHERE id=16`),
    knex.raw(`UPDATE dashboard_item SET y=8 WHERE id=17`),
    knex.raw(`UPDATE dashboard_item SET y=12 WHERE id=18`),
    knex.raw(`DELETE FROM dashboard_item WHERE id in (37, 38, 39)`),
  ])
}
