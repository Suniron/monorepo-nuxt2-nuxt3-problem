CREATE TABLE comment_remediation_project (
    id serial
    , fk_remediation_project_id integer NOT NULL
    , fk_user_id UUID NOT NULL
    , fk_remediation_project_status_history_id integer
    , comment varchar NOT NULL
    , created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);