CREATE TABLE comment_watch (
    id SERIAL,
    vulnerability_asset_id integer,
    revision_id integer,
    user_id UUID,
    new_comment boolean
);