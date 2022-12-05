CREATE TABLE asset_web (
    id integer,
    type character varying default 'WEB'
        check(type = 'WEB'),
    url character varying,
    language character varying
);