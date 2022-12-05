CREATE TABLE cipher_suite (
    id SERIAL,
    port_id integer,
    strength character varying,
    tls character varying,
    names text[]
);