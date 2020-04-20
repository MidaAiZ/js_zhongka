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

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id bigint NOT NULL,
    number character varying NOT NULL,
    password_digest character varying NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    tel character varying DEFAULT ''::character varying NOT NULL,
    name character varying DEFAULT ''::character varying NOT NULL,
    role character varying DEFAULT 'admin'::character varying NOT NULL,
    avatar character varying DEFAULT ''::character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: car_bodies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.car_bodies (
    id bigint NOT NULL,
    body_id character varying,
    body_type character varying,
    brand character varying,
    status integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    max_weight character varying,
    loc character varying DEFAULT ''::character varying
);


--
-- Name: car_bodies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.car_bodies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: car_bodies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.car_bodies_id_seq OWNED BY public.car_bodies.id;


--
-- Name: car_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.car_heads (
    id bigint NOT NULL,
    car_number character varying,
    head_type character varying,
    fuel_type character varying,
    brand character varying,
    status integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    loc character varying DEFAULT ''::character varying
);


--
-- Name: car_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.car_heads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: car_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.car_heads_id_seq OWNED BY public.car_heads.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drivers (
    id bigint NOT NULL,
    name character varying,
    tel character varying,
    gender integer,
    age date,
    join_time date,
    info jsonb,
    remark character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.drivers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: drivers_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drivers_orders (
    driver_id bigint,
    order_id bigint
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_number character varying,
    price double precision,
    car_number character varying,
    car_body_id integer,
    goods character varying,
    weight double precision,
    origin character varying,
    destination character varying,
    distance character varying,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    oil_consumption double precision,
    oil_fee double precision,
    toll_gate integer,
    road_toll double precision,
    state integer,
    last_state integer,
    customer_id integer,
    remark character varying,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    total_fee integer DEFAULT 0 NOT NULL,
    via_stations character varying DEFAULT ''::character varying,
    pay1_amount integer,
    pay1_type character varying,
    pay1_time timestamp without time zone,
    pay2_amount integer,
    pay2_type character varying,
    pay2_time timestamp without time zone,
    customer_name character varying,
    customer_tel character varying
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: orders_sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders_sales (
    sale_id bigint,
    order_id bigint
);


--
-- Name: sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales (
    id bigint NOT NULL,
    name character varying,
    tel character varying,
    gender integer,
    age date,
    join_time date,
    info jsonb,
    remark character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- Name: schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedules (
    id bigint NOT NULL,
    name character varying,
    begin_time timestamp(0) without time zone,
    end_time timestamp(0) without time zone,
    car_head_id integer,
    car_body_id integer,
    executor character varying,
    "desc" character varying,
    state integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: car_bodies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car_bodies ALTER COLUMN id SET DEFAULT nextval('public.car_bodies_id_seq'::regclass);


--
-- Name: car_heads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car_heads ALTER COLUMN id SET DEFAULT nextval('public.car_heads_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- Name: schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: car_bodies car_bodies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car_bodies
    ADD CONSTRAINT car_bodies_pkey PRIMARY KEY (id);


--
-- Name: car_heads car_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car_heads
    ADD CONSTRAINT car_heads_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: idx_drivers_orders_on_oid_did; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_drivers_orders_on_oid_did ON public.drivers_orders USING btree (order_id, driver_id);


--
-- Name: idx_orders_sales_on_oid_sid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_orders_sales_on_oid_sid ON public.orders_sales USING btree (order_id, sale_id);


--
-- Name: index_car_bodies_on_body_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_car_bodies_on_body_id ON public.car_bodies USING btree (body_id);


--
-- Name: index_car_heads_on_car_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_car_heads_on_car_number ON public.car_heads USING btree (car_number);


--
-- Name: index_drivers_orders_on_driver_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_drivers_orders_on_driver_id ON public.drivers_orders USING btree (driver_id);


--
-- Name: index_orders_on_car_body_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_orders_on_car_body_id ON public.orders USING btree (car_body_id);


--
-- Name: index_orders_on_car_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_orders_on_car_number ON public.orders USING btree (car_number);


--
-- Name: index_orders_sales_on_sale_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_orders_sales_on_sale_id ON public.orders_sales USING btree (sale_id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20200404075635'),
('20200404183910'),
('20200411142355'),
('20200411150458'),
('20200414155107'),
('20200414160759'),
('20200414180807'),
('20200414181241'),
('20200418151411'),
('20200418163238'),
('20200418173334'),
('20200419052423'),
('20200420031256');


