CREATE TABLE project_status (
    id integer UNIQUE
    , name varchar(255) NOT NULL UNIQUE
    , weight integer NOT NULL
);