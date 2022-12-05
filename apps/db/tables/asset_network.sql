CREATE TABLE asset_network (
    id integer,
    type character varying default 'NETWORK'
        check(type = 'NETWORK'),
    netmask character varying,
    network character varying,
    gateway character varying
);