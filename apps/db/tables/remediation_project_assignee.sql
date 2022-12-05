CREATE TABLE remediation_project_assignee (
    id serial
    , fk_project_id integer NOT NULL
    , fk_user_id UUID NOT NULL
);