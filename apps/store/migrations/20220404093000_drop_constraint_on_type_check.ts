exports.up = (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.alterTable('asset', async () => {
    await knex.raw(
      `ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "asset_type_check";`
    )
  })
}

exports.down = () => {
  return null
}
