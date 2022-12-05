CREATE TABLE scan_asset (
    id serial,
    scan_id integer,
    asset_id integer,
    port_id integer,
    ip_id integer,
    uri_id integer,
    vulnerability_asset_id integer,
    cpe_asset_id integer,
	site_map_id integer,
	cipher_suite_id integer
);
