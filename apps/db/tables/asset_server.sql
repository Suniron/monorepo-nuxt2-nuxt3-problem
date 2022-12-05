CREATE TABLE asset_server (
    id integer,
    type character varying default 'SERVER'
        check(type = 'SERVER'),
    os character varying,
    os_version character varying,
    os_build character varying,
    hostname character varying,
    o365_id character varying,
    aad_device_id character varying,
    first_seen date,
    last_seen date,
    os_processor character varying,
    architecture character varying,
    health_status character varying,
    external_address character varying,
    defender_av_status character varying,
    is_ad_joined boolean,
    onboarding_status character varying,
    managed_by character varying,
    managed_by_status character varying
);