// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = (knex: any) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('asset_server', (table: any) => {
    table.string('os_build')
    table.string('o365_id')
    table.string('aad_device_id')
    table.datetime('first_seen')
    table.datetime('last_seen')
    table.string('os_processor')
    table.string('architecture')
    table.string('health_status')
    table.string('external_address')
    table.string('defender_av_status')
    table.boolean('is_ad_joined')
    table.string('onboarding_status')
    table.string('managed_by')
    table.string('managed_by_status')
  });
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex: any) => {
  return knex.schema.table('asset_server', (table: any) => {
    table.dropColumn('os_build')
    table.dropColumn('o365_id')
    table.dropColumn('aad_device_id')
    table.dropColumn('first_seen')
    table.dropColumn('last_seen')
    table.dropColumn('os_processor')
    table.dropColumn('architecture')
    table.dropColumn('health_status')
    table.dropColumn('external_address')
    table.dropColumn('defender_av_status')
    table.dropColumn('is_ad_joined')
    table.dropColumn('onboarding_status')
    table.dropColumn('managed_by')
    table.dropColumn('managed_by_status')
  });
}
