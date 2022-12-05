CREATE TABLE relation (
    id SERIAL,
    type character varying, -- CONNECTED_TO, MAINTAINED_BY, OWN_BY, LOCATED_TO
    from_asset_id integer,
    to_asset_id integer
);
