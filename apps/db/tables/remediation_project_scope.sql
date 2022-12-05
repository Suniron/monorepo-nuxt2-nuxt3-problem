CREATE TABLE remediation_project_scope (
    id serial
    , fk_project_id integer NOT NULL
    , fk_vulnerability_asset_id integer
    , deleted_asset_name varchar
    , deleted_vulnerability_name varchar
    , is_done boolean NOT NULL DEFAULT false
);