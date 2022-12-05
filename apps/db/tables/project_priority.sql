CREATE TABLE project_priority (
    id integer UNIQUE
    , name varchar(255) NOT NULL UNIQUE
    , weight integer NOT NULL
);