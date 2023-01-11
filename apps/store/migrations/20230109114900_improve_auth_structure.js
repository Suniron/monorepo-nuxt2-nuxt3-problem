// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = async (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup)
    return Promise.resolve()

  // == Clean up ==
  await knex.raw('DELETE FROM user_session WHERE user_id IS NULL OR type NOT IN (\'access\', \'refresh\');')
  await knex.raw('DELETE FROM user_session WHERE token IS NULL;')

  // == Enum ==
  await knex.raw('CREATE TYPE "JwtTokenType" AS ENUM (\'access\', \'refresh\');')

  // == Tables ==
  // = user_session =
  // Edit the "type" column to change type to "JwtTokenType" & NOT NULL
  await knex.raw('ALTER TABLE user_session ALTER COLUMN type TYPE "JwtTokenType" USING type::"JwtTokenType";')
  await knex.raw('ALTER TABLE user_session ALTER COLUMN type SET NOT NULL;')
  // Add new "fully_connected_at" timestamp column to "user_session" table
  await knex.raw('ALTER TABLE user_session ADD fully_connected_at timestamptz NULL;')
  // Add UNIQUE constraint to token column
  await knex.raw('ALTER TABLE user_session ADD CONSTRAINT user_session_token_unique UNIQUE (token);')
  await knex.raw('ALTER TABLE token ALTER COLUMN type SET NOT NULL;')
  // Add NOT NULL constraint to "user_id" column
  await knex.raw('ALTER TABLE user_session ALTER COLUMN user_id SET NOT NULL;')
  // Add NOT NULL constraint to "created_at" column
  await knex.raw('ALTER TABLE user_session ALTER COLUMN created_at SET NOT NULL;')

  // = user =
  // Add "two_factor_secret" column to "user" table
  await knex.raw('ALTER TABLE "user" ADD two_factor_secret varchar;')
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = async (knex) => {
  // Remove "JwtTokenType" enum
  await knex.raw('DROP TYPE "JwtTokenType";')

  // Remove "fully_connected_at" column to "user_session" table
  await knex.schema.table('user_session', (table) => {
    table.dropColumn('fully_connected_at')
  })
  // Remove UNIQUE constraint to token column
  await knex.raw('ALTER TABLE user_session DROP CONSTRAINT user_session_token_unique;')
  // Remove NOT NULL constraint to "user_id" column
  await knex.raw('ALTER TABLE user_session ALTER COLUMN user_id DROP NOT NULL;')

  // Remove "two_factor_secret" column to "user" table
  await knex.raw('ALTER TABLE "user" DROP COLUMN two_factor_secret;')
}
