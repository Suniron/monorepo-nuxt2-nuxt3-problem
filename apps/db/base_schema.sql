--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0 (Debian 13.0-1.pgdg100+1)
-- Dumped by pg_dump version 13.0 (Debian 13.0-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: xrator; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE xrator WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE xrator OWNER TO postgres;

\connect xrator

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset (
    id integer NOT NULL,
    assets_network_id integer,
    name character varying,
    cpe character varying
);


ALTER TABLE public.asset OWNER TO postgres;

--
-- Name: asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asset_id_seq OWNER TO postgres;

--
-- Name: asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_id_seq OWNED BY public.asset.id;


--
-- Name: asset_network_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_network_tag (
    asset_network_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.asset_network_tag OWNER TO postgres;

--
-- Name: asset_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_tag (
    asset_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.asset_tag OWNER TO postgres;

--
-- Name: assets_network; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets_network (
    id integer NOT NULL,
    company_id integer,
    name character varying,
    network character varying,
    cidr integer
);


ALTER TABLE public.assets_network OWNER TO postgres;

--
-- Name: assets_network_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_network_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assets_network_id_seq OWNER TO postgres;

--
-- Name: assets_network_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_network_id_seq OWNED BY public.assets_network.id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.company_id_seq OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: cpe_asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cpe_asset (
    id integer NOT NULL,
    asset_id integer,
    cpe character varying
);


ALTER TABLE public.cpe_asset OWNER TO postgres;

--
-- Name: cpe_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cpe_asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cpe_asset_id_seq OWNER TO postgres;

--
-- Name: cpe_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cpe_asset_id_seq OWNED BY public.cpe_asset.id;


--
-- Name: credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credential (
    id integer NOT NULL,
    asset_id integer,
    username character varying,
    password character varying,
    domain character varying
);


ALTER TABLE public.credential OWNER TO postgres;

--
-- Name: credential_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credential_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credential_id_seq OWNER TO postgres;

--
-- Name: credential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credential_id_seq OWNED BY public.credential.id;


--
-- Name: credinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credinfo (
    id integer NOT NULL,
    scan_id integer,
    os character varying,
    cred_type character varying,
    username character varying,
    password character varying,
    port integer,
    key character varying,
    sudo_user character varying,
    sudo_password character varying,
    dc character varying,
    domain character varying
);


ALTER TABLE public.credinfo OWNER TO postgres;

--
-- Name: credinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credinfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credinfo_id_seq OWNER TO postgres;

--
-- Name: credinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credinfo_id_seq OWNED BY public.credinfo.id;


--
-- Name: cvss; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cvss (
    id integer NOT NULL,
    code character varying,
    score double precision,
    version double precision
);


ALTER TABLE public.cvss OWNER TO postgres;

--
-- Name: cvss_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cvss_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cvss_id_seq OWNER TO postgres;

--
-- Name: cvss_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cvss_id_seq OWNED BY public.cvss.id;


--
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."group" (
    id integer NOT NULL,
    user_id integer,
    name character varying
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- Name: group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_id_seq OWNER TO postgres;

--
-- Name: group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_id_seq OWNED BY public."group".id;


--
-- Name: info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.info (
    id integer NOT NULL,
    scan_id integer,
    network character varying,
    cidr integer,
    address character varying
);


ALTER TABLE public.info OWNER TO postgres;

--
-- Name: info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.info_id_seq OWNER TO postgres;

--
-- Name: info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.info_id_seq OWNED BY public.info.id;


--
-- Name: ip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ip (
    id integer NOT NULL,
    asset_id integer,
    address character varying,
    mac character varying,
    iface character varying
);


ALTER TABLE public.ip OWNER TO postgres;

--
-- Name: ip_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ip_id_seq OWNER TO postgres;

--
-- Name: ip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ip_id_seq OWNED BY public.ip.id;


--
-- Name: mitre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mitre (
    id integer NOT NULL,
    vulnerability_id integer,
    code character varying
);


ALTER TABLE public.mitre OWNER TO postgres;

--
-- Name: mitre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mitre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mitre_id_seq OWNER TO postgres;

--
-- Name: mitre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mitre_id_seq OWNED BY public.mitre.id;


--
-- Name: neighbour_ip_to_ip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighbour_ip_to_ip (
    left_id integer NOT NULL,
    right_id integer NOT NULL
);


ALTER TABLE public.neighbour_ip_to_ip OWNER TO postgres;

--
-- Name: neighbour_ip_to_net; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighbour_ip_to_net (
    ip_id integer NOT NULL,
    assets_network_id integer NOT NULL
);


ALTER TABLE public.neighbour_ip_to_net OWNER TO postgres;

--
-- Name: neighbour_net_to_ip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighbour_net_to_ip (
    assets_network_id integer NOT NULL,
    ip_id integer NOT NULL
);


ALTER TABLE public.neighbour_net_to_ip OWNER TO postgres;

--
-- Name: neighbour_net_to_net; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighbour_net_to_net (
    left_id integer NOT NULL,
    right_id integer NOT NULL
);


ALTER TABLE public.neighbour_net_to_net OWNER TO postgres;

--
-- Name: port; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.port (
    id integer NOT NULL,
    ip_id integer,
    number integer,
    version character varying,
    service character varying,
    protocol character varying,
    detail character varying,
    cpe character varying
);


ALTER TABLE public.port OWNER TO postgres;

--
-- Name: port_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.port_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.port_id_seq OWNER TO postgres;

--
-- Name: port_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.port_id_seq OWNED BY public.port.id;


--
-- Name: reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reference (
    id integer NOT NULL,
    vulnerability_id integer,
    type character varying,
    value character varying
);


ALTER TABLE public.reference OWNER TO postgres;

--
-- Name: reference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reference_id_seq OWNER TO postgres;

--
-- Name: reference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reference_id_seq OWNED BY public.reference.id;


--
-- Name: result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.result (
    id integer NOT NULL,
    scan_id integer,
    raw_file bytea
);


ALTER TABLE public.result OWNER TO postgres;

--
-- Name: result_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.result_id_seq OWNER TO postgres;

--
-- Name: result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.result_id_seq OWNED BY public.result.id;


--
-- Name: scan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scan (
    id integer NOT NULL,
    company_id integer,
    cdate date,
    container_id character varying,
    url character varying,
    client character varying,
    status character varying,
    agent character varying
);


ALTER TABLE public.scan OWNER TO postgres;

--
-- Name: scan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scan_id_seq OWNER TO postgres;

--
-- Name: scan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scan_id_seq OWNED BY public.scan.id;


--
-- Name: scan_ip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scan_ip (
    id integer NOT NULL,
    scan_id integer,
    ip_id integer,
    port_id integer,
    vulnerability_ip_id integer,
    cpe_asset_id integer
);


ALTER TABLE public.scan_ip OWNER TO postgres;

--
-- Name: scan_ip_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scan_ip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scan_ip_id_seq OWNER TO postgres;

--
-- Name: scan_ip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scan_ip_id_seq OWNED BY public.scan_ip.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    company_id integer,
    username character varying,
    password character varying,
    email character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: vulnerability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vulnerability (
    id integer NOT NULL,
    oid character varying,
    name character varying,
    description character varying,
    remediation character varying,
    insight character varying,
    affected character varying,
    vulndetect character varying
);


ALTER TABLE public.vulnerability OWNER TO postgres;

--
-- Name: vulnerability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vulnerability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vulnerability_id_seq OWNER TO postgres;

--
-- Name: vulnerability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vulnerability_id_seq OWNED BY public.vulnerability.id;


--
-- Name: vulnerability_ip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vulnerability_ip (
    id integer NOT NULL,
    vulnerability_id integer,
    ip_id integer,
    port_id integer,
    cvss_id integer,
    cpe character varying,
    details character varying
);


ALTER TABLE public.vulnerability_ip OWNER TO postgres;

--
-- Name: vulnerability_ip_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vulnerability_ip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vulnerability_ip_id_seq OWNER TO postgres;

--
-- Name: vulnerability_ip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vulnerability_ip_id_seq OWNED BY public.vulnerability_ip.id;


--
-- Name: asset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset ALTER COLUMN id SET DEFAULT nextval('public.asset_id_seq'::regclass);


--
-- Name: assets_network id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_network ALTER COLUMN id SET DEFAULT nextval('public.assets_network_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: cpe_asset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset ALTER COLUMN id SET DEFAULT nextval('public.cpe_asset_id_seq'::regclass);


--
-- Name: credential id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential ALTER COLUMN id SET DEFAULT nextval('public.credential_id_seq'::regclass);


--
-- Name: credinfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo ALTER COLUMN id SET DEFAULT nextval('public.credinfo_id_seq'::regclass);


--
-- Name: cvss id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvss ALTER COLUMN id SET DEFAULT nextval('public.cvss_id_seq'::regclass);


--
-- Name: group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group" ALTER COLUMN id SET DEFAULT nextval('public.group_id_seq'::regclass);


--
-- Name: info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info ALTER COLUMN id SET DEFAULT nextval('public.info_id_seq'::regclass);


--
-- Name: ip id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip ALTER COLUMN id SET DEFAULT nextval('public.ip_id_seq'::regclass);


--
-- Name: mitre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre ALTER COLUMN id SET DEFAULT nextval('public.mitre_id_seq'::regclass);


--
-- Name: port id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port ALTER COLUMN id SET DEFAULT nextval('public.port_id_seq'::regclass);


--
-- Name: reference id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference ALTER COLUMN id SET DEFAULT nextval('public.reference_id_seq'::regclass);


--
-- Name: result id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result ALTER COLUMN id SET DEFAULT nextval('public.result_id_seq'::regclass);


--
-- Name: scan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan ALTER COLUMN id SET DEFAULT nextval('public.scan_id_seq'::regclass);


--
-- Name: scan_ip id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip ALTER COLUMN id SET DEFAULT nextval('public.scan_ip_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: vulnerability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability ALTER COLUMN id SET DEFAULT nextval('public.vulnerability_id_seq'::regclass);


--
-- Name: vulnerability_ip id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip ALTER COLUMN id SET DEFAULT nextval('public.vulnerability_ip_id_seq'::regclass);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: asset asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_id_key UNIQUE (id);


--
-- Name: asset_network_tag asset_network_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network_tag
    ADD CONSTRAINT asset_network_tag_pkey PRIMARY KEY (asset_network_id, tag_id);


--
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (id);


--
-- Name: asset_tag asset_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_tag
    ADD CONSTRAINT asset_tag_pkey PRIMARY KEY (asset_id, tag_id);


--
-- Name: assets_network assets_network_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_network
    ADD CONSTRAINT assets_network_pkey PRIMARY KEY (id);


--
-- Name: company company_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_id_key UNIQUE (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: cpe_asset cpe_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_id_key UNIQUE (id);


--
-- Name: cpe_asset cpe_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_pkey PRIMARY KEY (id);


--
-- Name: credential credential_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT credential_id_key UNIQUE (id);


--
-- Name: credential credential_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT credential_pkey PRIMARY KEY (id);


--
-- Name: credinfo credinfo_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_id_key UNIQUE (id);


--
-- Name: credinfo credinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_pkey PRIMARY KEY (id);


--
-- Name: cvss cvss_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvss
    ADD CONSTRAINT cvss_id_key UNIQUE (id);


--
-- Name: cvss cvss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvss
    ADD CONSTRAINT cvss_pkey PRIMARY KEY (id);


--
-- Name: group group_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_id_key UNIQUE (id);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (id);


--
-- Name: info info_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_id_key UNIQUE (id);


--
-- Name: info info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_pkey PRIMARY KEY (id);


--
-- Name: ip ip_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_id_key UNIQUE (id);


--
-- Name: ip ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_pkey PRIMARY KEY (id);


--
-- Name: mitre mitre_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_id_key UNIQUE (id);


--
-- Name: mitre mitre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_pkey PRIMARY KEY (id);


--
-- Name: neighbour_ip_to_ip neighbour_ip_to_ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_ip
    ADD CONSTRAINT neighbour_ip_to_ip_pkey PRIMARY KEY (left_id, right_id);


--
-- Name: neighbour_ip_to_net neighbour_ip_to_net_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_net
    ADD CONSTRAINT neighbour_ip_to_net_pkey PRIMARY KEY (ip_id, assets_network_id);


--
-- Name: neighbour_net_to_ip neighbour_net_to_ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_ip
    ADD CONSTRAINT neighbour_net_to_ip_pkey PRIMARY KEY (assets_network_id, ip_id);


--
-- Name: neighbour_net_to_net neighbour_net_to_net_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_net
    ADD CONSTRAINT neighbour_net_to_net_pkey PRIMARY KEY (left_id, right_id);


--
-- Name: port port_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_id_key UNIQUE (id);


--
-- Name: port port_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_pkey PRIMARY KEY (id);


--
-- Name: reference reference_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_id_key UNIQUE (id);


--
-- Name: reference reference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_pkey PRIMARY KEY (id);


--
-- Name: result result_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_id_key UNIQUE (id);


--
-- Name: result result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_pkey PRIMARY KEY (id);


--
-- Name: scan scan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_id_key UNIQUE (id);


--
-- Name: scan_ip scan_ip_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_id_key UNIQUE (id);


--
-- Name: scan_ip scan_ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_pkey PRIMARY KEY (id);


--
-- Name: scan scan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_pkey PRIMARY KEY (id);


--
-- Name: tag tag_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_id_key UNIQUE (id);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: user user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_key UNIQUE (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: vulnerability vulnerability_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability
    ADD CONSTRAINT vulnerability_id_key UNIQUE (id);


--
-- Name: vulnerability_ip vulnerability_ip_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_id_key UNIQUE (id);


--
-- Name: vulnerability_ip vulnerability_ip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_pkey PRIMARY KEY (id);


--
-- Name: vulnerability vulnerability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability
    ADD CONSTRAINT vulnerability_pkey PRIMARY KEY (id);


--
-- Name: asset asset_assets_network_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_assets_network_id_fkey FOREIGN KEY (assets_network_id) REFERENCES public.assets_network(id);


--
-- Name: asset_network_tag asset_network_tag_asset_network_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network_tag
    ADD CONSTRAINT asset_network_tag_asset_network_id_fkey FOREIGN KEY (asset_network_id) REFERENCES public.assets_network(id);


--
-- Name: asset_network_tag asset_network_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_network_tag
    ADD CONSTRAINT asset_network_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- Name: asset_tag asset_tag_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_tag
    ADD CONSTRAINT asset_tag_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- Name: asset_tag asset_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_tag
    ADD CONSTRAINT asset_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- Name: assets_network assets_network_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets_network
    ADD CONSTRAINT assets_network_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: cpe_asset cpe_asset_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpe_asset
    ADD CONSTRAINT cpe_asset_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- Name: credential credential_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT credential_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- Name: credinfo credinfo_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credinfo
    ADD CONSTRAINT credinfo_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id);


--
-- Name: group group_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: info info_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id);


--
-- Name: ip ip_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip
    ADD CONSTRAINT ip_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- Name: mitre mitre_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitre
    ADD CONSTRAINT mitre_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id);


--
-- Name: neighbour_ip_to_ip neighbour_ip_to_ip_left_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_ip
    ADD CONSTRAINT neighbour_ip_to_ip_left_id_fkey FOREIGN KEY (left_id) REFERENCES public.ip(id);


--
-- Name: neighbour_ip_to_ip neighbour_ip_to_ip_right_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_ip
    ADD CONSTRAINT neighbour_ip_to_ip_right_id_fkey FOREIGN KEY (right_id) REFERENCES public.ip(id);


--
-- Name: neighbour_ip_to_net neighbour_ip_to_net_assets_network_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_net
    ADD CONSTRAINT neighbour_ip_to_net_assets_network_id_fkey FOREIGN KEY (assets_network_id) REFERENCES public.assets_network(id);


--
-- Name: neighbour_ip_to_net neighbour_ip_to_net_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_ip_to_net
    ADD CONSTRAINT neighbour_ip_to_net_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id);


--
-- Name: neighbour_net_to_ip neighbour_net_to_ip_assets_network_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_ip
    ADD CONSTRAINT neighbour_net_to_ip_assets_network_id_fkey FOREIGN KEY (assets_network_id) REFERENCES public.assets_network(id);


--
-- Name: neighbour_net_to_ip neighbour_net_to_ip_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_ip
    ADD CONSTRAINT neighbour_net_to_ip_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id);


--
-- Name: neighbour_net_to_net neighbour_net_to_net_left_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_net
    ADD CONSTRAINT neighbour_net_to_net_left_id_fkey FOREIGN KEY (left_id) REFERENCES public.assets_network(id);


--
-- Name: neighbour_net_to_net neighbour_net_to_net_right_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighbour_net_to_net
    ADD CONSTRAINT neighbour_net_to_net_right_id_fkey FOREIGN KEY (right_id) REFERENCES public.assets_network(id);


--
-- Name: port port_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.port
    ADD CONSTRAINT port_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id);


--
-- Name: reference reference_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT reference_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id);


--
-- Name: result result_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result
    ADD CONSTRAINT result_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id);


--
-- Name: scan scan_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan
    ADD CONSTRAINT scan_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: scan_ip scan_ip_cpe_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_cpe_asset_id_fkey FOREIGN KEY (cpe_asset_id) REFERENCES public.cpe_asset(id);


--
-- Name: scan_ip scan_ip_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id);


--
-- Name: scan_ip scan_ip_port_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_port_id_fkey FOREIGN KEY (port_id) REFERENCES public.port(id);


--
-- Name: scan_ip scan_ip_scan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_scan_id_fkey FOREIGN KEY (scan_id) REFERENCES public.scan(id);


--
-- Name: scan_ip scan_ip_vulnerability_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scan_ip
    ADD CONSTRAINT scan_ip_vulnerability_ip_id_fkey FOREIGN KEY (vulnerability_ip_id) REFERENCES public.vulnerability_ip(id);


--
-- Name: user user_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: vulnerability_ip vulnerability_ip_cvss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_cvss_id_fkey FOREIGN KEY (cvss_id) REFERENCES public.cvss(id);


--
-- Name: vulnerability_ip vulnerability_ip_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.ip(id);


--
-- Name: vulnerability_ip vulnerability_ip_port_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_port_id_fkey FOREIGN KEY (port_id) REFERENCES public.port(id);


--
-- Name: vulnerability_ip vulnerability_ip_vulnerability_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerability_ip
    ADD CONSTRAINT vulnerability_ip_vulnerability_id_fkey FOREIGN KEY (vulnerability_id) REFERENCES public.vulnerability(id);


--
-- PostgreSQL database dump complete
--

