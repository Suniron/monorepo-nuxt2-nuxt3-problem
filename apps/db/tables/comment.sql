CREATE TABLE comment (
    id SERIAL,
    vulnerability_asset_id integer,
    revision_id integer,
    reply_comment_id integer,
    user_id UUID,
    title character varying,
    comment text,
    created_at timestamp,
    updated_at timestamp,
    is_evidence boolean
);