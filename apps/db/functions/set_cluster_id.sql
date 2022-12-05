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