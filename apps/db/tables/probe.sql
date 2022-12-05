CREATE TABLE probe (
    id serial,
    company_id integer,
    store_id UUID,
    cdate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name character varying,
    probe_type "ProbeType",
    status character varying,
    gw character varying,
    exit_ip character varying,
    address character varying,
    mask character varying,
    mac character varying,
    url character varying,
    info character varying
);