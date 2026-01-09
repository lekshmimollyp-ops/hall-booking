--
-- PostgreSQL database dump
--

\restrict tQfeUU6lzNKT9yqBLlxp2loUFpIXApIcMiw1ojwnWo6JMuU3CNueHOJfQel1WWk

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: centers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.centers (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    logo_url character varying(255),
    primary_color character varying(255) DEFAULT '#000000'::character varying NOT NULL,
    address text,
    contact_phone character varying(255),
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT centers_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.centers OWNER TO postgres;

--
-- Name: centers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.centers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.centers_id_seq OWNER TO postgres;

--
-- Name: centers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.centers_id_seq OWNED BY public.centers.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id bigint NOT NULL,
    center_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(255),
    address text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    center_id bigint NOT NULL,
    client_id bigint NOT NULL,
    event_date date NOT NULL,
    start_time time(0) without time zone NOT NULL,
    end_time time(0) without time zone NOT NULL,
    event_type character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'blocked'::character varying NOT NULL,
    advance_amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    booked_amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    created_by bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    resource_id bigint,
    discount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    CONSTRAINT events_status_check CHECK (((status)::text = ANY ((ARRAY['blocked'::character varying, 'booked'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_categories_id_seq OWNER TO postgres;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id bigint NOT NULL,
    center_id bigint NOT NULL,
    event_id bigint,
    category_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    expense_date date NOT NULL,
    description text,
    created_by bigint NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: incomes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incomes (
    id bigint NOT NULL,
    center_id bigint NOT NULL,
    event_id bigint NOT NULL,
    amount_received numeric(10,2) NOT NULL,
    received_date date NOT NULL,
    payment_mode character varying(255) NOT NULL,
    created_by bigint NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT incomes_payment_mode_check CHECK (((payment_mode)::text = ANY ((ARRAY['cash'::character varying, 'bank'::character varying, 'upi'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.incomes OWNER TO postgres;

--
-- Name: incomes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incomes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incomes_id_seq OWNER TO postgres;

--
-- Name: incomes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incomes_id_seq OWNED BY public.incomes.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    notifiable_type character varying(255) NOT NULL,
    notifiable_id bigint NOT NULL,
    data text NOT NULL,
    read_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    id bigint NOT NULL,
    center_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    capacity integer,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT resources_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: user_centers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_centers (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    center_id bigint NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_centers OWNER TO postgres;

--
-- Name: user_centers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_centers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_centers_id_seq OWNER TO postgres;

--
-- Name: user_centers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_centers_id_seq OWNED BY public.user_centers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'staff'::character varying])::text[]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: centers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centers ALTER COLUMN id SET DEFAULT nextval('public.centers_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: incomes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incomes ALTER COLUMN id SET DEFAULT nextval('public.incomes_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: user_centers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_centers ALTER COLUMN id SET DEFAULT nextval('public.user_centers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: centers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.centers (id, name, logo_url, primary_color, address, contact_phone, status, created_at, updated_at) FROM stdin;
1	MT Hall Pazhakutty	\N	#3b51f7	Pazhakutty, Nedumangadu, Trivandrum	+91 9645 368 788	active	2026-01-08 05:20:43	2026-01-08 12:30:35
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, center_id, name, phone, address, created_at, updated_at) FROM stdin;
1	1	Abdul Rahim	9744156220	Anzar Manzil Kuracode	2026-01-08 06:19:37	2026-01-08 06:19:37
2	1	Cable operator	9999999999	Pazhakutty	2026-01-08 09:54:30	2026-01-08 09:54:30
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, center_id, client_id, event_date, start_time, end_time, event_type, status, advance_amount, booked_amount, created_by, created_at, updated_at, resource_id, discount) FROM stdin;
2	1	2	2026-02-03	09:00:00	14:00:00	Corporate	booked	10000.00	150000.00	6	2026-01-08 09:54:30	2026-01-08 10:11:34	2	0.00
1	1	1	2026-01-04	09:00:00	15:00:00	Wedding	booked	5000.00	95000.00	6	2026-01-08 06:19:37	2026-01-08 12:28:57	\N	2000.00
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, name, created_at) FROM stdin;
1	Food	2026-01-08 12:47:38
2	Decoration	2026-01-08 12:47:39
3	Electricity	2026-01-08 12:47:39
4	Cleaning	2026-01-08 12:47:39
5	Staff	2026-01-08 12:47:39
6	Maintenance	2026-01-08 12:47:39
7	Waste Management	2026-01-08 12:47:39
8	Fuel	2026-01-08 13:08:00
9	Provisions	2026-01-08 13:08:59
10	Fund	2026-01-08 13:11:40
12	Others	2026-01-08 13:08:59
11	Salary	2026-01-08 18:03:57
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, center_id, event_id, category_id, amount, expense_date, description, created_by, created_at) FROM stdin;
1	1	1	4	5000.00	2026-01-04	for 5 people	6	2026-01-08 12:57:33
3	1	1	5	1500.00	2026-01-04	bata	6	2026-01-08 13:03:18
4	1	1	6	3000.00	2026-01-08	hall cleaning and additional cleaning	6	2026-01-08 13:04:13
5	1	1	9	200.00	2026-01-08	lotion and soap for cleaning	6	2026-01-08 13:09:45
6	1	1	7	1200.00	2026-01-08	\N	6	2026-01-08 13:10:11
7	1	1	8	500.00	2026-01-08	disel	6	2026-01-08 13:10:37
\.


--
-- Data for Name: incomes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incomes (id, center_id, event_id, amount_received, received_date, payment_mode, created_by, created_at) FROM stdin;
1	1	1	5000.00	2026-01-01	cash	6	2026-01-08 12:33:10
2	1	1	88000.00	2026-01-04	cash	6	2026-01-08 12:39:19
3	1	2	10000.00	2026-01-08	cash	6	2026-01-08 15:25:16
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2026_01_01_000000_create_all_tables	1
2	2026_01_08_050730_create_personal_access_tokens_table	2
3	2026_01_08_000000_create_resources_table	3
4	2026_01_08_070507_add_discount_to_events_table	4
5	2026_01_08_085041_create_notifications_table	5
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, notifiable_type, notifiable_id, data, read_at, created_at, updated_at) FROM stdin;
24736fac-f9db-42dd-a493-c498699b8087	App\\Notifications\\EventCreated	App\\Models\\User	7	{"type":"event","message":"New Corporate booked for 2026-02-03","event_id":2,"center_id":1}	\N	2026-01-08 09:54:32	2026-01-08 09:54:32
6dfd8d02-b3b8-42fc-aaa1-450c91315004	App\\Notifications\\EventCreated	App\\Models\\User	6	{"type":"event","message":"New Corporate booked for 2026-02-03","event_id":2,"center_id":1}	2026-01-08 09:57:21	2026-01-08 09:54:32	2026-01-08 09:57:21
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\User	6	auth_token	72f8a678e62b1b1ae8d03876472e508df4bcd7a0be9b00dc9243e1956f310d2f	["*"]	\N	\N	2026-01-08 05:08:22	2026-01-08 05:08:22
2	App\\Models\\User	6	auth_token	9321d3738eb918ef81ed204f969757a022e57b8519475fb9486ff97e9bfb6d41	["*"]	\N	\N	2026-01-08 05:09:25	2026-01-08 05:09:25
3	App\\Models\\User	6	auth_token	6602bdfa4842379f602fda266bd977e0c6a1ac29bca70a2a944bbe87ce76cac3	["*"]	\N	\N	2026-01-08 05:09:37	2026-01-08 05:09:37
4	App\\Models\\User	6	auth_token	8e5b02858a34dd099696a831394c5cd4aa5813cf04cd6f167cfa955dbea68dc9	["*"]	\N	\N	2026-01-08 05:09:53	2026-01-08 05:09:53
5	App\\Models\\User	6	auth_token	f225407a7718ecef5449106526696fcd60a1551ec785c613cc00a4a88923d656	["*"]	\N	\N	2026-01-08 05:11:18	2026-01-08 05:11:18
6	App\\Models\\User	6	auth_token	3b7a38fcc015d17a13eb2b7636f6da42db4a0adcc508e2c9ca7fd34117978c0b	["*"]	2026-01-08 05:12:03	\N	2026-01-08 05:12:02	2026-01-08 05:12:03
7	App\\Models\\User	6	auth_token	c4e0a04d1f7da26a825514ac2dc3ee0edd515cc012c2560f8e6253c23585e8db	["*"]	2026-01-08 05:12:51	\N	2026-01-08 05:12:50	2026-01-08 05:12:51
8	App\\Models\\User	6	auth_token	4f9d50c0453265cd546e4fb67a19f21e01ec9ab9f484f78312230b22c28aabff	["*"]	2026-01-08 05:14:46	\N	2026-01-08 05:14:45	2026-01-08 05:14:46
9	App\\Models\\User	6	auth_token	ba90fa242dfba5c310d8681540d4524fc7993571c2781b7806070bdf8fa268f4	["*"]	2026-01-08 05:17:24	\N	2026-01-08 05:17:24	2026-01-08 05:17:24
21	App\\Models\\User	6	auth_token	dc90a6d6b31cb55a200c89631ca562f9ed60a153725cf9349ab0813a108427e9	["*"]	2026-01-08 09:55:18	\N	2026-01-08 09:49:14	2026-01-08 09:55:18
19	App\\Models\\User	6	auth_token	56e847252368cf3bbc9a10352d5838e3d412d3a33af0b898abda0880a2f7f961	["*"]	2026-01-08 09:43:11	\N	2026-01-08 09:41:25	2026-01-08 09:43:11
18	App\\Models\\User	6	auth_token	4440ebb7691a8e644521fce489ee645a4eca9333f5db3117f9d9c1f187eaf2ac	["*"]	2026-01-08 09:36:08	\N	2026-01-08 09:35:53	2026-01-08 09:36:08
11	App\\Models\\User	6	auth_token	3ce44b582e9906d1c7d8912f828e74340107646dae82a07367d4338942f010fc	["*"]	2026-01-08 05:35:39	\N	2026-01-08 05:35:37	2026-01-08 05:35:39
12	App\\Models\\User	6	auth_token	af0816e566e1054de7addea2d558a854bb64ec6237fb04cc1eae8794de6a6f26	["*"]	2026-01-08 06:03:55	\N	2026-01-08 06:03:49	2026-01-08 06:03:55
16	App\\Models\\User	6	auth_token	9f5150f69d5fe4bffc272b0ffb32c43be02066eea00417257d7c89686928f795	["*"]	2026-01-08 09:30:18	\N	2026-01-08 09:30:06	2026-01-08 09:30:18
15	App\\Models\\User	6	auth_token	e1bda9345d0f060784dabc795af01184b6ff3c0f72ccc1332b6bda1e0096d01b	["*"]	2026-01-08 09:26:57	\N	2026-01-08 09:26:34	2026-01-08 09:26:57
17	App\\Models\\User	6	auth_token	2659e61651336a1462a87ca5b59265aef911356e72226eebde381cab132bed76	["*"]	2026-01-08 09:33:51	\N	2026-01-08 09:31:53	2026-01-08 09:33:51
22	App\\Models\\User	6	auth_token	2b0edd654a0530e7f38a6f2888deb6d4a8f2f0a9089f88e3c07843b5300b4940	["*"]	2026-01-08 12:31:27	\N	2026-01-08 09:50:33	2026-01-08 12:31:27
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resources (id, center_id, name, description, capacity, status, created_at, updated_at) FROM stdin;
2	1	Main Building	\N	\N	active	2026-01-08 06:44:48	2026-01-08 06:44:48
\.


--
-- Data for Name: user_centers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_centers (id, user_id, center_id, created_at) FROM stdin;
1	6	1	2026-01-08 10:50:43
2	7	1	2026-01-08 11:51:28
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, phone, password, role, status, created_at, updated_at) FROM stdin;
6	Admin User	admin@booking.com	9645368788	$2y$12$wzHgwb87g1skbUYIweCk1u.JvoY664gA015cvbelNdMnJkBxSFA3.	admin	active	2026-01-08 05:03:43	2026-01-08 09:56:04
7	Ani	ani@booking.com	8606464795	$2y$12$UTORVpFLMqfsbERrQq7Btex8nGlQvhlj3rjn5LqV4eH7WVKqY1R9.	staff	active	2026-01-08 06:21:28	2026-01-08 09:56:36
\.


--
-- Name: centers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.centers_id_seq', 1, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 2, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 2, true);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 7, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 7, true);


--
-- Name: incomes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incomes_id_seq', 3, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 5, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 22, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resources_id_seq', 2, true);


--
-- Name: user_centers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_centers_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: centers centers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centers
    ADD CONSTRAINT centers_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: incomes incomes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT incomes_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: user_centers user_centers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_centers
    ADD CONSTRAINT user_centers_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: notifications_notifiable_type_notifiable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_notifiable_type_notifiable_id_index ON public.notifications USING btree (notifiable_type, notifiable_id);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: clients clients_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: events events_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: events events_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: events events_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_foreign FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: events events_resource_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_resource_id_foreign FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: expenses expenses_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON DELETE CASCADE;


--
-- Name: expenses expenses_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: expenses expenses_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_created_by_foreign FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: expenses expenses_event_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_event_id_foreign FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: incomes incomes_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT incomes_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: incomes incomes_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT incomes_created_by_foreign FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: incomes incomes_event_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT incomes_event_id_foreign FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: resources resources_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: user_centers user_centers_center_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_centers
    ADD CONSTRAINT user_centers_center_id_foreign FOREIGN KEY (center_id) REFERENCES public.centers(id) ON DELETE CASCADE;


--
-- Name: user_centers user_centers_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_centers
    ADD CONSTRAINT user_centers_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict tQfeUU6lzNKT9yqBLlxp2loUFpIXApIcMiw1ojwnWo6JMuU3CNueHOJfQel1WWk

