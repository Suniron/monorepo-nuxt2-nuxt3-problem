CREATE TABLE revision (
    id SERIAL,
    store_id UUID,
    asset_document_id integer,
    cdate date,
    revision character varying,
    description character varying
);