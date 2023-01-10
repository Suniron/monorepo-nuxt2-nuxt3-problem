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
  // Remove lines from "user_session" table where "user_id" is NULL or "type" is not "access" or "refresh":
  await knex.raw('DELETE FROM user_session WHERE user_id IS NULL OR type NOT IN (\'access\', \'refresh\');')

  // == Enum ==
  await knex.raw('CREATE TYPE "JwtTokenType" AS ENUM (\'access\', \'refresh\');')

  // == Table "user_session" ==
  // Edit the "type" column to change type to "JwtTokenType"
  await knex.raw('ALTER TABLE user_session ALTER COLUMN type TYPE "JwtTokenType" USING type::"JwtTokenType";')
  // Add new "fully_connected_at" timestamp column to "user_session" table
  await knex.raw('ALTER TABLE user_session ADD fully_connected_at timestamptz NULL;')
  // Add UNIQUE constraint to token column
  await knex.raw('ALTER TABLE user_session ADD CONSTRAINT user_session_token_unique UNIQUE (token);')
  // Add NOT NULL constraint to "user_id" column
  await knex.raw('ALTER TABLE user_session ALTER COLUMN user_id SET NOT NULL;')
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = async (knex) => {
  // Remove "fully_connected_at" column to "user_session" table
  await knex.schema.table('user_session', (table) => {
    table.dropColumn('fully_connected_at')
  })

  // Remove UNIQUE constraint to token column
  await knex.raw('ALTER TABLE user_session DROP CONSTRAINT user_session_token_unique;')

  // Remove NOT NULL constraint to "user_id" column
  await knex.raw('ALTER TABLE user_session ALTER COLUMN user_id DROP NOT NULL;')
}
