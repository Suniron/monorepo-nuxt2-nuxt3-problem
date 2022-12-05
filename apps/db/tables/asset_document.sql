CREATE TABLE asset_document (
    id integer,
    type character varying
        check(type in ('POLICY', 'PROCEDURE')),
    location character varying
);