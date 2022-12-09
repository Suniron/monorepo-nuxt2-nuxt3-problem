
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
    CREATE OR REPLACE FUNCTION public.set_cluster_id()
      RETURNS TRIGGER
      LANGUAGE plpgsql
    AS $function$
    BEGIN
    
      IF NEW.remediation IS DISTINCT FROM OLD.remediation OR OLD IS NULL THEN
        UPDATE public.vulnerability
        SET cluster_id = subquery.cluster_id
        FROM (
          SELECT
          COALESCE(min(cluster_id), (SELECT max(cluster_id) + 1 FROM public.vulnerability v2))
          AS cluster_id
        FROM
          public.vulnerability v
        WHERE
          v.remediation IS NOT DISTINCT FROM NEW.remediation
          AND v.id <> NEW.id
        ) AS subquery
        WHERE id = NEW.id;
    
      END IF;
      
      RETURN NEW;
    
    END;
    
    $function$
    ;
  `)
  await knex.raw(`
    CREATE TRIGGER update_cluster_on_update
      AFTER UPDATE
      ON public.vulnerability
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_cluster_id();
    
    
    CREATE TRIGGER update_cluster_on_insert
      AFTER INSERT
      ON public.vulnerability
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_cluster_id();
    `)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw('DROP FUNCTION public.set_cluster_id() CASCADE;')
}
