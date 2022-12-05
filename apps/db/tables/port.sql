CREATE TABLE port (
    id serial,
    ip_id integer,
    cpe_id integer,
    number integer,
    version character varying,
    service character varying,
    protocol character varying,
    detail character varying,
    status character varying
);