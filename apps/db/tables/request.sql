CREATE TABLE request (
    id SERIAL,
    uri_id integer,
    type character varying,
    method character varying,
    http_version character varying,
    parameters character varying,
    body character varying
);
