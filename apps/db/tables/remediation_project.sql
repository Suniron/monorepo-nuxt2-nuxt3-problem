CREATE TABLE remediation_project (
    id serial
    , fk_company_id integer NOT NULL
    , name varchar(255) NOT NULL
    , description varchar NOT NULL
    , fk_owner UUID NOT NULL
    , fk_priority_id integer NOT NULL
    , start_date TIMESTAMP WITH TIME ZONE
    , creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    , due_date TIMESTAMP WITH TIME ZONE NOT NULL
);