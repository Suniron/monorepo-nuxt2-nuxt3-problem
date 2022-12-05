CREATE TABLE dashboard_user (
    user_id UUID NOT NULL,
    dashboard_item_id integer NOT NULL,
    x integer,
    y integer,
    width integer,
    height integer,
    visible boolean
);