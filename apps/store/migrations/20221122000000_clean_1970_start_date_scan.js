// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
    UPDATE public.scan SET start_date = NULL
    WHERE start_date = '1970-01-01'::date;
  `)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  // Nothing to rollback
}
