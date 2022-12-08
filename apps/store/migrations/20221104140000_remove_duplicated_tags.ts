// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  // Temporarily removing the primary key constraint
  await knex.raw(`
    ALTER TABLE public.tag_asset drop CONSTRAINT IF EXISTS "tag_asset_pkey";
  `)

  // Update all "tag_id" foreign keys of table "tag_asset" to the first tag with the same tag name
  await knex.raw(`
    UPDATE
      tag_asset
    SET
      tag_id = (
        SELECT
          id
        FROM
          tag
        WHERE
          name = (
            SELECT
              name
            FROM
              tag
            WHERE
              id = tag_asset.tag_id
          )
        ORDER BY
          id ASC
        LIMIT 1
      )
  `)

  // Deleting potential duplicate rows from tag_asset
  await knex.raw(
    `DELETE
      FROM tag_asset ta 
      WHERE ctid IN (
        SELECT ctid FROM (
          SELECT asset_id, tag_id, ctid, row_number() OVER (PARTITION BY asset_id, tag_id) AS rn FROM tag_asset
        ) t WHERE rn > 1
      );`
  )

  // Delete all duplicated tags
  await knex.raw(`
    DELETE FROM
      tag
    WHERE
      id IN (
        SELECT
          id
        FROM
          (
            SELECT
              id,
              name,
              ROW_NUMBER() OVER (
                PARTITION BY
                  name
                ORDER BY
                  id ASC
              ) AS row_number
            FROM
              tag
          ) AS t
        WHERE
          t.row_number > 1
      )
  `)

  // Adding back the primary key constraint
  await knex.raw(`
    ALTER TABLE ONLY public.tag_asset ADD CONSTRAINT tag_asset_pkey PRIMARY KEY (asset_id, tag_id);
  `)

  // Adding back the primary key constraint
  await knex.raw(`
    ALTER TABLE ONLY public.tag
      ADD CONSTRAINT tag_name_un UNIQUE ("name",company_id);
  `)
}

exports.down = async () => {
  // Nothing to rollback
}
