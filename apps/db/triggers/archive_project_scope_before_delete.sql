create trigger archive_project_scope_before_asset_vuln_delete before delete
  on public.vulnerability_asset for each row execute function public.archive_asset_vuln_project_scope();

create trigger archive_project_scope_before_asset_delete before delete
  on public.asset for each row execute function public.archive_asset_vuln_project_scope();