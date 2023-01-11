CREATE TABLE "user" (
    id UUID DEFAULT uuid_generate_v4(),
    company_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    username VARCHAR,
    password VARCHAR,
    salt VARCHAR,
    two_factor_secret VARCHAR,
    two_factor_confirmed_at TIMESTAMP WITH TIME ZONE,
    is_two_factor_required BOOLEAN DEFAULT true,
    email VARCHAR,
    roles TEXT[],
    reset_token VARCHAR,
    token_expires_at VARCHAR
);
