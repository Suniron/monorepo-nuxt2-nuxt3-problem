CREATE TABLE asset_building (
    id integer,
    type character varying default 'BUILDING'
        check(type = 'BUILDING'),
    location character varying,
    longitude character varying,
    latitude character varying,
    postal_address character varying,
    phone_number character varying
);
