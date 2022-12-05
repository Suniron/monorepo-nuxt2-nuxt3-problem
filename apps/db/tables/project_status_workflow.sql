CREATE TABLE project_status_workflow (
    id serial
    , transition varchar(255) NOT NULL
    , fk_from_status_id integer NOT NULL
    , fk_to_status_id integer NOT NULL
);