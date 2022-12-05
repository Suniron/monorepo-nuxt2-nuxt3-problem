CREATE TABLE store (
    id UUID DEFAULT uuid_generate_v4(),
    name character varying,
    type character varying,
    md5 character varying,
    size integer,
    udate timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    path character varying
)