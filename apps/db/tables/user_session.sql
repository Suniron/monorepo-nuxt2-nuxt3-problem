CREATE TABLE user_session(
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token VARCHAR UNIQUE,
  type "JwtTokenType" NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- To handle two factor authentication:
  fully_connected_at TIMESTAMP WITH TIME ZONE
)
