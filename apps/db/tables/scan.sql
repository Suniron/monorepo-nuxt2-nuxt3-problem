CREATE TABLE scan (
    id serial,
    company_id integer,
    probe_id integer,
    name character varying,
    cdate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sdate TIMESTAMP WITH TIME ZONE,
    fdate TIMESTAMP WITH TIME ZONE,
    start_date date,
    end_date date,
    start_time time WITH TIME ZONE,
    end_time time WITH TIME ZONE,
    scan_type character varying,
    container_id character varying,
    parameters JSON,
    status character varying
);
