CREATE TABLE "user" (
    id UUID DEFAULT uuid_generate_v4(),
    company_id integer,
    first_name varchar,
    last_name varchar,
    username varchar,
    password varchar,
    salt varchar,
    two_factor_secret varchar
    email varchar,
    roles text[],
    reset_token varchar,
    token_expires_at varchar
);
