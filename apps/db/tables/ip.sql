CREATE TABLE ip (
    id serial,
    asset_server_id integer,
    type character varying,
    address character varying,
    mac character varying,
    iface character varying,
    mask character varying,
    operational_status character varying,
    is_main boolean default false
);