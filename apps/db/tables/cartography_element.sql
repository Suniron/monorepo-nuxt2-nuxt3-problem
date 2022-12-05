CREATE TABLE cartography_element (
    id SERIAL,
    cartography_id integer,
    asset_id integer,
    relation_id integer,
    cygroup character varying,
    parent character varying,
    x float,
    y float
);