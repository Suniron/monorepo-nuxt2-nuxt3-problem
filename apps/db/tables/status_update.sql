CREATE TABLE status_update (
    id SERIAL,
    vulnerability_asset_id integer,
    orig_status character varying,
    updated_status character varying,
    cdate timestamp,
    comment character varying
);
