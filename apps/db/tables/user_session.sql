CREATE TABLE user_session(
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID,
  token VARCHAR,
  -- 'access' or 'refresh'
  type VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- To handle two factor authentication:
  fullyConnectedAt TIMESTAMP WITH TIME ZONE
)
