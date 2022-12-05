CREATE TABLE user_session(
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID,
  token VARCHAR,
  type VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
)