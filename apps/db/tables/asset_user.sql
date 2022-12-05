CREATE TABLE asset_user (
    id integer,
    type character varying default 'USER'
        check(type = 'USER'),
    position character varying,
    mail character varying,
    tel character varying
);