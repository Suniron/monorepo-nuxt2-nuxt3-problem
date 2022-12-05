CREATE TABLE remediation_project_status_history (
    id serial
    , fk_project_id integer NOT NULL
    , fk_user_id UUID
    , fk_status_id integer NOT NULL DEFAULT 1
    , start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    , end_date TIMESTAMP WITH TIME ZONE
);