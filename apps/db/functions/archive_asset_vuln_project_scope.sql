CREATE OR REPLACE FUNCTION public.archive_asset_vuln_project_scope()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
   asset_name varchar ;
   vuln_name varchar ;
begin

  -- If executing on asset table
  if (TG_TABLE_NAME = 'asset') then

    select old.name
    into asset_name;
  
    update public.remediation_project_scope
    set deleted_asset_name = asset_name
    from vulnerability_asset va
    where va.asset_id = old.id
      and va.id = public.remediation_project_scope.fk_vulnerability_asset_id;

  end if;

  -- If executing on vulnerability_asset table
  if (TG_TABLE_NAME = 'vulnerability_asset') then
  
    select asset.name
    into asset_name
    from public.asset
    where old.asset_id = asset.id ;

    -- If the asset still exists after asset vulnerability deletion
    if (asset_name is not null) then
    
      select name
      into vuln_name
      from public.vulnerability
      where id = old.vulnerability_id;
      
      update public.remediation_project_scope
      set deleted_asset_name = asset_name,
        deleted_vulnerability_name = vuln_name
      where public.remediation_project_scope.fk_vulnerability_asset_id = old.id;
    end if;

  end if;

  return old;
end;

$function$
;
