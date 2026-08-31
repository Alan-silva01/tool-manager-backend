--
-- PostgreSQL database cluster dump
--

\restrict lw6AIgLpelboTvXbC0YbFvcH4JoynH0S6e3eatWBVcu1MceHRhRL7qe5LAKcvv4

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT anon TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticated TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT authenticated TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT pg_create_subscription TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_signal_backend TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT service_role TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT service_role TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;






\unrestrict lw6AIgLpelboTvXbC0YbFvcH4JoynH0S6e3eatWBVcu1MceHRhRL7qe5LAKcvv4

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict ic3QGdWpP86y2QOs1EeOAoSx5DImXGhWypzdxWSbaOeEpH7M0GKyCIoljkhjuLb

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict ic3QGdWpP86y2QOs1EeOAoSx5DImXGhWypzdxWSbaOeEpH7M0GKyCIoljkhjuLb

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict jDvi3rd81uaennZkCKECX87ay5k7RRctm7FaltCsOmwejcIFSPloxkGlkdFxtbQ

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA public;


--
-- Name: EXTENSION http; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION http IS 'HTTP client for PostgreSQL, allows web page retrieval inside the database.';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: setor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.setor AS ENUM (
    'Usinagem industrial',
    'Oficina cantilever',
    'Oficina de guias',
    'Montagem de gaiola',
    'Oficina de mancal',
    'Usinagem de cilindros',
    'Oficina central',
    'Outro'
);


ALTER TYPE public.setor OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: atualizar_estoque_baixo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.atualizar_estoque_baixo() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  novo_estoque_baixo BOOLEAN;
BEGIN
  -- Calcula se o estoque está baixo
  novo_estoque_baixo := (NEW.entrada - NEW.saida) <= NEW.quantidade_minima;

  -- Atualiza a coluna estoque_baixo
  NEW.estoque_baixo := novo_estoque_baixo;

  -- Se o novo estoque_baixo for true e antes era false, envia para o webhook
  IF novo_estoque_baixo = TRUE AND (OLD.estoque_baixo IS DISTINCT FROM TRUE) THEN
    PERFORM http_post(
      'https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/estoque-baixo',
      'application/json',
      json_build_object(
        'id', NEW.id,
        'entrada', NEW.entrada,
        'saida', NEW.saida,
        'quantidade_minima', NEW.quantidade_minima,
        'estoque_baixo', TRUE
      )::text
    );
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.atualizar_estoque_baixo() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: is_authenticated(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_authenticated() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT auth.uid() IS NOT NULL;
$$;


ALTER FUNCTION public.is_authenticated() OWNER TO postgres;

--
-- Name: search_materiais(character varying, numeric, integer, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_materiais(p_nome character varying DEFAULT NULL::character varying, p_tag numeric DEFAULT NULL::numeric, p_quant integer DEFAULT NULL::integer, p_data_entrada text DEFAULT NULL::text, p_estoque_baixo boolean DEFAULT NULL::boolean) RETURNS TABLE(nome text, quantidade_disponivel integer, tag numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.nome,
        (COALESCE(m.entrada, 0) - COALESCE(m.saida, 0))::INTEGER AS quantidade_disponivel,
        m.tag
    FROM materiais m
    WHERE
        (p_nome IS NULL OR unaccent(m.nome) ILIKE '%' || unaccent(p_nome) || '%')
        AND (p_tag IS NULL OR m.tag = p_tag)
        AND (p_data_entrada IS NULL OR m.data_entrada_estoque ILIKE '%' || p_data_entrada || '%')
        AND (p_quant IS NULL OR (m.entrada - m.saida) = p_quant)
        AND (p_estoque_baixo IS NULL OR m.estoque_baixo = p_estoque_baixo)
    ORDER BY m.nome ASC;
END;
$$;


ALTER FUNCTION public.search_materiais(p_nome character varying, p_tag numeric, p_quant integer, p_data_entrada text, p_estoque_baixo boolean) OWNER TO postgres;

--
-- Name: search_tools(character varying, character varying, character varying, integer, character varying, text[], text, numeric, text, boolean, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_tools(p_nome character varying DEFAULT NULL::character varying, p_tipo character varying DEFAULT NULL::character varying, p_status character varying DEFAULT NULL::character varying, p_quant integer DEFAULT NULL::integer, p_tag character varying DEFAULT NULL::character varying, p_caracteristicas text[] DEFAULT NULL::text[], p_funcionario text DEFAULT NULL::text, p_matricula numeric DEFAULT NULL::numeric, p_data_emprestado text DEFAULT NULL::text, p_reserva boolean DEFAULT NULL::boolean, p_matricula_reserva text DEFAULT NULL::text, p_detalhado boolean DEFAULT false) RETURNS TABLE(nome text, tag text, quantidade_disponivel integer, tipo text, status text, quantidade_total integer, caracteristicas jsonb, id uuid, funcionario_emprestado text, matricula numeric, data_emprestado text, reserva boolean, matricula_reserva text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    IF p_detalhado THEN
        RETURN QUERY
        SELECT 
            f.nome,
            f.tag,
            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,
            f.categoria AS tipo,
            f.status,
            COALESCE(f.quantidade, 0)::INTEGER AS quantidade_total,
            f.caracteristicas,
            f.id,
            f.funcionario_emprestado,
            f.matricula,
            f.data_emprestado,
            f.reserva,
            f.matricula_reserva
        FROM ferramentas f
        WHERE
            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')
            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))
            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))
            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))
            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')
            AND (p_matricula IS NULL OR f.matricula = p_matricula)
            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')
            AND (p_reserva IS NULL OR f.reserva = p_reserva)
            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')
            AND (
                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant
            )
            AND (
                p_caracteristicas IS NULL OR (
                    array_length(p_caracteristicas, 1) > 0 AND
                    EXISTS (
                        SELECT 1
                        FROM unnest(p_caracteristicas) AS c
                        WHERE EXISTS (
                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv
                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'
                        )
                    )
                )
            )
        ORDER BY f.nome ASC;

    ELSE
        RETURN QUERY
        SELECT 
            f.nome,
            f.tag,
            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,
            NULL::TEXT AS tipo,
            NULL::TEXT AS status,
            NULL::INTEGER AS quantidade_total,
            NULL::JSONB AS caracteristicas,
            NULL::UUID AS id,
            NULL::TEXT AS funcionario_emprestado,
            NULL::NUMERIC AS matricula,
            NULL::TEXT AS data_emprestado,
            NULL::BOOLEAN AS reserva,
            NULL::TEXT AS matricula_reserva
        FROM ferramentas f
        WHERE
            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')
            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))
            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))
            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))
            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')
            AND (p_matricula IS NULL OR f.matricula = p_matricula)
            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')
            AND (p_reserva IS NULL OR f.reserva = p_reserva)
            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')
            AND (
                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant
            )
            AND (
                p_caracteristicas IS NULL OR (
                    array_length(p_caracteristicas, 1) > 0 AND
                    EXISTS (
                        SELECT 1
                        FROM unnest(p_caracteristicas) AS c
                        WHERE EXISTS (
                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv
                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'
                        )
                    )
                )
            )
        ORDER BY f.nome ASC;
    END IF;
END;
$$;


ALTER FUNCTION public.search_tools(p_nome character varying, p_tipo character varying, p_status character varying, p_quant integer, p_tag character varying, p_caracteristicas text[], p_funcionario text, p_matricula numeric, p_data_emprestado text, p_reserva boolean, p_matricula_reserva text, p_detalhado boolean) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: ferramentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ferramentas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text,
    tag text NOT NULL,
    quantidade numeric,
    categoria text,
    saiu numeric,
    caracteristicas jsonb,
    funcionario_emprestado text,
    matricula numeric,
    data_emprestado text,
    status text GENERATED ALWAYS AS (
CASE
    WHEN (saiu = (1)::numeric) THEN 'emprestada'::text
    ELSE 'disponível'::text
END) STORED,
    reserva boolean,
    matricula_reserva text
);


ALTER TABLE public.ferramentas OWNER TO postgres;

--
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    matricula numeric NOT NULL,
    setor public.setor NOT NULL,
    numero_whatsapp text,
    posse_ferramentas jsonb DEFAULT '[]'::jsonb,
    cod_nfc numeric
);


ALTER TABLE public.funcionarios OWNER TO postgres;

--
-- Name: materiais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materiais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    quantidade_minima numeric NOT NULL,
    entrada numeric NOT NULL,
    saida numeric NOT NULL,
    data_entrada_estoque text,
    tag numeric,
    unidade text,
    estoque_baixo boolean DEFAULT false
);


ALTER TABLE public.materiais OWNER TO postgres;

--
-- Name: n8n_chat_avb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.n8n_chat_avb (
    id integer NOT NULL,
    session_id character varying(255) NOT NULL,
    message jsonb NOT NULL
);


ALTER TABLE public.n8n_chat_avb OWNER TO postgres;

--
-- Name: n8n_chat_avb_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.n8n_chat_avb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.n8n_chat_avb_id_seq OWNER TO postgres;

--
-- Name: n8n_chat_avb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.n8n_chat_avb_id_seq OWNED BY public.n8n_chat_avb.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: registro_mate_funcionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_mate_funcionarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    funcionario text,
    material text,
    quantidade numeric,
    data text,
    matricula text
);


ALTER TABLE public.registro_mate_funcionarios OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: n8n_chat_avb id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.n8n_chat_avb ALTER COLUMN id SET DEFAULT nextval('public.n8n_chat_avb_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: ferramentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ferramentas (id, nome, tag, quantidade, categoria, saiu, caracteristicas, funcionario_emprestado, matricula, data_emprestado, reserva, matricula_reserva) FROM stdin;
d969f505-8dda-4b87-b25c-43ea9c53fc2e	Micrômetro de profundidade	00807253888	1	Medidor	0	{}	VITOR ALEXANDRE DA SILVA SOARES	13106	19-08-2025	f	\N
fc965983-3f9d-4cf6-9cda-94a5bd1f29ac	Alicate de pressão	00807253894	1	Manual	0	\N	VITOR ALEXANDRE DA SILVA SOARES	13106	19-08-2025	f	\N
aa76b31a-9675-424a-b593-63269a3bdefd	Cavalete Hidráulico	00807253901	1	Hidráulica	0	\N	\N	\N	\N	f	
1171d6da-f274-406b-ab5e-5c10b0034f38	Paralelas Magnéticas	00807253898	1	Fixação	0	\N	\N	\N	\N	f	\N
a8e8ff8a-5959-4599-9b2d-c969dae342d3	Compressor Portátil	00807253910	1	Pneumática	0	\N	\N	\N	\N	f	\N
55cfdb23-cd73-4146-a0e7-339b873f1ff0	Chave de Impacto	00807253906	1	Elétrica	0	\N	\N	\N	\N	f	
539910fa-ba60-4414-84a6-5936735e6cd3	Extrator de Rolamento	00807253902	1	Extração	0	\N	\N	\N	\N	f	
435b46fc-4c22-45a5-92da-97bed7e50d3c	Suporte de Solda	00807253895	1	Acessório	0	\N	\N	\N	\N	f	\N
431c5b5e-bc23-4aac-a2be-00df486bc3e8	Base magnética	00807253904	1	Fixação	0	{}	\N	\N	\N	f	\N
56a5fdea-f771-4873-ae87-080f37cf57ac	Medidor de Espessura	00807253900	1	Medidor	0	\N	\N	\N	\N	f	\N
a9a05295-3cf8-4bb9-b77a-6c50d4c77fa1	Fixador de Guia	00807253899	1	Fixação	0	\N	\N	\N	\N	f	\N
09005ae8-b3ba-40cb-a98e-e84c8e86fc35	Broca de aço rápido	00807253885	1	Corte	0	{}	\N	\N	\N	f	
dfb77fa8-9500-4b19-a4f9-fec7ebddbfa6	Soquete Longo 19mm	00807253907	1	Manual	0	\N	\N	\N	\N	f	\N
ada37dd8-9424-477c-b316-b0f769ac5769	Chave Combinada 13mm	00807253923	1	Manual	0	\N	\N	\N	\N	f	\N
4c30ba93-42b3-47a1-b778-e1e59327cb51	Martelo Pena	00807253919	1	Manual	0	\N	\N	\N	\N	f	\N
64b356a4-e857-4392-86d2-37788751b984	Etiquetadora Manual	00807253913	1	Organização	0	\N	\N	\N	\N	f	\N
7407a680-c4b4-46fa-8cf2-686024408088	Organizador de Ferramentas	00807253912	1	Organização	0	\N	\N	\N	\N	f	\N
83781e84-bcbd-414b-8a8c-0eef8ac5673c	Medidor de Torque	00807253883	1	Medidor	0	\N	\N	\N	\N	f	\N
ae30ecf8-cc45-4c16-8bd3-e1c3b4536590	Estilete Industrial	00807253922	1	Manual	0	\N	\N	\N	\N	f	\N
258bc460-a0c6-42c2-9bd6-d1b270705134	Kit Brocas Aço Rápido	00807253921	1	Corte	0	\N	\N	\N	\N	f	\N
e048af94-9a94-4822-9612-68c6e6fd1b2b	Mandril de Precisão	00807253882	1	Fixação	0	\N	\N	\N	\N	f	\N
a17eb441-2990-45d5-851e-fe961cd29e1b	Lanterna de Inspeção LED	00807253925	1	Iluminação	0	\N	\N	\N	\N	f	\N
ef4653d4-1007-4c11-94f9-d06cbd19b4cc	Carrinho de Ferramentas	00807253915	1	Mobiliário	0	\N	\N	\N	\N	f	\N
bd4a0a63-bb7c-4242-8929-b9cf19a9c513	Chave de torque digital	00807253886	1	Medidor eletrônico	0	{}	\N	\N	\N	f	\N
c2cfce30-c690-49d6-81b1-795dc0508cf9	Conjunto de Mancal	00807253903	1	Componente	0	\N	\N	\N	\N	f	\N
f518a35d-f2c9-42b2-9b8b-3835424a8fe6	Relógio Comparador	00807253917	1	Medidor	0	\N	\N	\N	\N	f	\N
fa43b444-ddc9-487b-a257-ae5d0ae77826	Morsa Giratória 5"	00807253924	1	Fixação	0	\N	\N	\N	\N	f	\N
4e74291f-b074-4355-8e80-b8b7a8b97373	Mandril Pneumático	00807253896	1	Pneumática	0	\N	\N	\N	\N	f	\N
9c7a44a7-0eb3-47f9-a7d8-0e2b8c50aa65	Lixadeira Elétrica	00807253889	1	Elétrica	0	\N	\N	\N	\N	f	\N
005edb82-a61a-4efe-9499-d223a8c9b5d9	Paquímetro Digital	00807253918	1	Medidor	0	\N	\N	\N	\N	f	
152be5d7-ac20-4778-92e7-c0f4556fe632	Calibrador de Eixo	00807253905	1	Medidor	0	\N	\N	\N	\N	f	\N
9d7604bd-2d2b-4962-9841-05bce732ef3f	Chave Inglesa 12"	00807253916	1	Manual	0	\N	\N	\N	\N	f	\N
cdd18035-16d4-4cc1-af7a-aab9416db00f	Chave Allen Jogo	00807253892	1	Manual	0	\N	EZEQUIEL PEREIRA DOS SANTOS	6789	19-09-2025	f	\N
d425b26d-b5d8-441a-8991-1964b0d6e36c	Alinhador de cilindros	00807253887	1	Alinhamento	0	{}	ALAN FERREIRA DA SILVA	1234	15-09-2025	f	
cbb03315-11a6-41d2-aadb-b038d6dd3c2d	Trena a Laser	00807253897	1	Medidor eletrônico	0	\N	\N	\N	\N	f	\N
cce1e649-101a-4cd7-ab5d-d2247269fde5	Multímetro Digital	00807253909	1	Medidor eletrônico	0	\N	\N	\N	\N	f	\N
d2db3c2c-56bb-4119-8148-ba1260d46aef	Fresa CNC 12mm	00807253881	1	Corte rotativo	0	\N	\N	\N	\N	f	\N
00532e94-a544-45a7-b22d-1c3165e0c7ea	Furadeira de Bancada	00807253908	1	Elétrica	0	{"cor": "Preta", "uso": "Perfuração em metais, plásticos e madeira", "nome": "Furadeira de Bancada", "peso": "15kg", "tipo": "Elétrica", "mandril": "13mm", "tensão": "220V", "material": "Aço e alumínio fundido", "potência": "500W", "fabricante": "FerramentasX", "segurança": {"chave geral": true, "protetor de mandril": true}, "velocidade": "5 níveis (620–3100 RPM)"}	\N	\N	\N	f	\N
804f2809-b9bc-4085-b93a-b4b4872b086d	Gabarito de Montagem	00807253891	1	Posicionamento	0	\N	\N	\N	\N	f	\N
a0fd52ac-2227-49f9-b543-15ffee3d1d00	Suporte de Ferramentas	00807253884	1	Organização	0	\N	\N	\N	\N	f	\N
4fcedc42-ae01-455a-80ad-d9cd9b61b7a3	Sapata de apoio	00807253890	1	Acessório	0	{"cor": "Preta", "uso": "Perfuração em metais, plásticos e madeira", "nome": "Furadeira de Bancada", "peso": "15kg", "tipo": "Elétrica", "mandril": "13mm", "tensão": "220V", "material": "Aço e alumínio fundido", "potência": "500W", "fabricante": "FerramentasX", "segurança": "[object Object]", "velocidade": "5 níveis (620–3100 RPM)"}	\N	\N	\N	f	\N
a21e5745-4bf4-450f-8144-cbc40c136f46	Martelo de Borracha	00807253893	1	Manual	0	\N	\N	\N	\N	f	\N
a33d419a-814f-4cb2-ae52-f299b62d9d83	Torquímetro Estalo	00807253920	1	Medidor	0	\N	\N	\N	\N	f	\N
0074e5ed-b7c0-41db-8c43-e182c9201367	Kit Ferramental Padrão	00807253914	1	Manual	0	\N	\N	\N	\N	f	\N
414edc2b-7494-46f1-85cf-e5173d338e64	Furadeira de Bancada	00846532887	1	Eletrica	0	{"cor": "Preta", "uso": "Perfuração em metais, plásticos e madeira", "nome": "Furadeira de Bancada", "peso": "15kg", "tipo": "Elétrica", "mandril": "13mm", "tensão": "220V", "material": "Aço e alumínio fundido", "potência": "500W", "fabricante": "FerramentasX", "segurança": {"chave geral": true, "protetor de mandril": true}, "velocidade": "5 níveis (620–3100 RPM)"}	\N	\N	\N	f	\N
65ed2d45-8b12-4398-a151-7f5703acb2b7	Furadeira	00987463874	1	Eletrica	0	{"cor": "preta, azul", "marca": "sthil", "tensao": "220v"}	\N	\N	\N	f	\N
\.


--
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionarios (id, nome, matricula, setor, numero_whatsapp, posse_ferramentas, cod_nfc) FROM stdin;
f20dca53-7fd6-42f9-a206-2835382e2d4f	KAROLAYNE VITORIA DA SILVA GOMES	12360	Usinagem de cilindros	\N	[]	\N
abb5e1a5-ecfc-420e-843a-c247c499b7d6	KAWAN SILVA FREITAS	14610	Usinagem industrial	\N	[]	\N
dd464e36-6f22-4a76-965c-452266696a9e	LEANDRO LOPES TORRES	12075	Oficina de guias	\N	[]	\N
bbcb9640-c687-43ec-b05f-7bedc7241624	LUCAS EDUARDO SOUSA SILVA	10039	Montagem de gaiola	\N	[]	\N
524b5a94-bb4d-49cd-91cc-09de9d16bdb3	MARCOS HENRIQUE DA SILVA NASCIMENTO	8732	Montagem de gaiola	\N	[]	\N
a34e399d-80f6-4d9d-96ad-405989636848	MATEUS BASSANI MENDES	7498	Oficina central	\N	[]	\N
5540a489-3447-4d90-88a0-2248ce8d358a	RAIMUNDO NONATO PALHANO VALE	13311	Usinagem industrial	\N	[]	\N
fc7e2100-fa4a-4bd6-bcef-1f89060bf547	RYAN FORTES SILVA	13813	Usinagem industrial	\N	[]	\N
0d6a789c-c60b-41f5-b5f8-896f12566a78	SAMUEL DA CRUZ FONSECA	12024	Oficina de guias	\N	[]	\N
1ecbba7c-9bd8-488a-bf17-7c3531bd5cfd	SEBASTIAO OLIVEIRA SOUSA FILHO	14467	Usinagem industrial	\N	[]	\N
3eaf5c2c-9b85-4f5f-a6f3-65369fe689fc	TAKAUÃ SILVA SOUSA	13844	Usinagem de cilindros	\N	[]	\N
93fb81dd-aa75-49ed-b2ef-dfdd3dd5cb92	TCHEWLLY COSTA AMORIM	11523	Usinagem industrial	\N	[]	\N
4b17be7f-7d7c-4188-ad74-5fc18ff88c2d	THYERRI DE JESUS ARAUJO	12023	Oficina central	\N	[]	\N
a444c9ca-4dc8-4c99-ae68-3913e555d815	TYSON WALKER DA SILVA DUARTE	11312	Usinagem industrial	\N	[]	\N
6cd1a2bf-7010-431b-b106-9adebc38ecc0	VICTOR BATISTA DE MEDEIROS	8735	Oficina cantilever	\N	[]	\N
01b7a199-3bd4-49b9-a71b-d43218a8b274	VINICIOS CUTRIM MENDES	3920	Oficina central	\N	[]	\N
ef3e7b85-fb1a-45f4-9f4b-77b834692d5a	WAGNER SERRA MOTA	1831	Montagem de gaiola	\N	[]	\N
e32a8296-7f10-49af-8cb0-237a2c119b50	WAKSON DE SOUSA ALMEIDA	4861	Oficina central	\N	[]	\N
e28baf00-9bd8-4bb5-bbe1-e6661e801967	ANDRE FELIPE COSTA SILVA	13812	Usinagem industrial		[]	\N
c02c727a-09e4-4fab-8f78-1eb4cd56a996	EZEQUIEL PEREIRA DOS SANTOS	6789	Oficina central	99992049180	[]	\N
c773b868-afbf-4c83-8300-f54657845f13	ALAN FERREIRA DA SILVA	1234	Oficina central	99991372552	[]	\N
d423ad73-607c-4014-a47a-7d92fc07e743	HELEN CRISTINA PEREIRA LIMA	13920	Oficina central	99991809543	[]	\N
5ac0bc30-8218-4fb1-b045-a6c0f5ff3fa3	VITOR ALEXANDRE DA SILVA SOARES	13106	Usinagem industrial	\N	[]	\N
6fa51ee7-8a47-45c7-9097-fedb986032d9	THIAGO HENRIQUE FERREIRA CUTRIM	4942	Oficina cantilever	\N	[]	\N
960ddf89-8721-4925-a75f-beeffe2478c4	WELINGTON DIAS CAMPOS	2345	Oficina central	99992026610	[]	\N
98e2a858-4ffb-46f8-a27b-f6fdf8547a8e	CARLOS EDUARDO OLIVEIRA SILVA	3954	Usinagem industrial	\N	[]	\N
0ab8dad1-4ace-496e-85da-7897492bb2aa	GERSON ARTHUR DE SOUSA SILVA	14611	Oficina de guias	\N	[]	\N
00f9d308-3c10-4526-83e7-450ea931b47e	GENILSON COSTA DE BRITO	8646	Montagem de gaiola	\N	[]	\N
0f9e505f-432a-45ca-85ce-29355a3675ea	JOSE ANTONIO SILVA JUNIOR	14673	Oficina central	\N	[]	\N
14479905-b6c2-4b54-9722-661908702ea7	JEFFERSON LUIS DE AGUIAR ALVES	7200	Usinagem de cilindros	\N	[]	\N
119e37aa-203e-4410-9197-2c3c52a8e997	ANGELO VALADARES DE CASTRO	7203	Usinagem industrial	\N	[]	\N
3bad7fa8-8460-4c84-b802-b9d6f247b494	DENIS RIULY SANTOS SOUSA	2355	Oficina de guias	\N	[]	\N
532df2fd-1f99-4840-8d41-6d51d6ff821a	ELIZEU SILVA JACONE	14108	Usinagem industrial	\N	[]	\N
58ba1d81-e4c3-4e51-b3e2-8995f31a957e	GABRIEL PASSOS DA MOTA	13849	Oficina de mancal	\N	[]	\N
b45a0112-13f9-428e-9cd4-f2f73241865a	CLEDENILSON RIBEIRO DE OLIVEIRA	12920	Usinagem industrial	\N	[]	\N
cfc0820c-ab42-48f3-8f69-d0ebf2a1e77c	CARLOS EDUARDO DA SILVA CRAVEIRO	8734	Usinagem de cilindros	\N	[]	\N
97bbc76b-c873-4d3b-b42f-25dd61fa4544	JOTUANDERSON PEREIRA GOMES	7679	Oficina cantilever	99984169577	[]	\N
efab03f3-713a-4cc1-a514-202dd88621ca	JACKSON GUILHERME COSTA DA SILVA	14201	Usinagem de cilindros	\N	[]	\N
f6b205a6-50f0-4413-bc5b-f3dbe61db5b6	JESIEL DA SILVA PEREIRA	11080	Usinagem industrial	\N	[]	\N
8cbc6899-17e1-4f41-933c-59fa10270e2e	ANTONIO UBIRAJARA SIQUEIRA MOREIRA	8854	Usinagem industrial	\N	[]	\N
\.


--
-- Data for Name: materiais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materiais (id, nome, quantidade_minima, entrada, saida, data_entrada_estoque, tag, unidade, estoque_baixo) FROM stdin;
f68c2573-54cd-49bd-92ef-fb072f28e702	Esponja de Aço	5	20	10	15-07-2025	10023	un	f
06cb332f-7f35-4354-bfea-33b576d21c73	Máscara de pano	21	70	1	08-08-2025	10011	un	f
bc0a64f8-b5a0-4529-ad74-304927a45648	Álcool isopropílico 1l	7	11	3	08-08-2025	10026	un	f
acb52785-c0d1-4e89-ad99-158c370e616c	Papelão Ondulado	5	15	9	12-07-2025	10014	un	f
8665473b-6edb-4a0a-be26-a49c9a514ed6	Cola tekbond 793	3	42	21	15-08-2025	10004	un	f
b5610760-96a2-4185-b851-89a10db1dce5	Fita Dupla Face	11	44	0	15-08-2025	10027	un	f
de5f3120-9df8-440b-a227-443fad13a065	Pano de chão	50	115	13	15-08-2025	10013	un	f
dd8d0aeb-0b2a-4760-be11-bbddbbc99bea	Desengraxante biodegradável	6	10	4	16-07-2025	10025	un	t
0235f205-7055-4f4c-b78d-35480b58ddba	Acetona	5	17	4	21-09-2025	10099	un	f
f9b390bb-a352-4f99-8b90-6e936020ca1a	Água Sanitária 5L	1	26	1	23-09-2025	10001	un	f
a2c36e7e-c227-418f-af70-9b3effeb159a	Estopa Industrial	15	40	13	13-07-2025	10016	un	f
bbbe795c-a988-4f4f-9e3f-a71830da6801	Marcador Permanente	5	15	5	14-07-2025	10019	un	f
bf5c8779-df79-4f51-a28c-9dd2fe034aad	Papel Toalha Industrial	10	25	8	10-07-2025	10008	un	f
4394a8ad-43bf-4d7d-99a3-f4094e38d16a	Graxa Azul	2	10	6	10-07-2025	10006	un	f
f99e2e36-3f11-4e9d-bbc1-769eb176a086	WD-40 300ml	5	15	6	10-07-2025	10005	un	f
a6605768-0bcd-4583-82a4-669444c545ff	Desengripante Spray	5	20	9	15-07-2025	10021	un	f
fcf46798-a007-470e-88ef-5c7084903722	Luva de Raspa de Couro	5	18	5	14-07-2025	10020	un	f
75f3e5c6-b202-4ae7-8d7d-33c3cf3fb61c	Tinta spray 	1	4	0	25-07-2025	10093	un	f
d8594062-7046-47ff-9dd1-7cd0576f3294	Silicone Spray	3	10	4	13-07-2025	10018	un	f
305a0eb9-a3bf-498a-8dec-1208e91a4535	Luva de couro	5	20	0	26-07-2025	10084	un	f
7c253fd5-de0f-4753-934b-7629b039a9a1	Balde plástico 20l	2	7	3	08-07-2025	10002	un	f
93d994de-6799-4585-a14c-cfc49d2d8441	Trapo de algodão	10	22	6	11-07-2025	10009	un	f
129d80ab-20e3-4f92-8f70-3be8a668d0c0	Desengraxante em gel	1	10	7	09-07-2025	10003	un	f
8bde6820-ed23-49b1-87f7-5d622881f3fc	Detergente Neutro	3	10	6	10-07-2025	10007	un	f
b85d27a3-7a24-494e-897f-a9eaba20b14d	Mascara quimica	12	29	2	25-07-2025	10065	un	f
77bf0d65-949f-4347-8e7d-8e7a055e95c9	Caneta marcadora	5	17	3	12-07-2025	10015	un	f
1b18c358-5d7c-4ed7-8817-ba4b416428a9	Fita isolante preta	1	25	12	17-07-2025	10028	un	f
07a689aa-4f12-4ea2-8443-1e6fba309482	Flanela para Limpeza	10	30	0	11-07-2025	10010	un	f
07ab2d4a-36fd-46cc-a89d-69d12e2d8553	Máscara PFF2	10	30	8	18-07-2025	10030	un	f
0ba08f14-9f0e-4f54-9a8b-8d5f68347880	Fita Crepe 25mm	5	20	6	11-07-2025	10012	un	f
1168b2a5-4939-4815-9249-e95be1d80b00	Lixa d’água 220	10	40	11	16-07-2025	10024	un	f
73e56a73-83d6-41cf-9034-31b6b4036f38	Rodo com cabo	2	22	2	13-07-2025	10017	un	f
379494bd-0add-4fe9-b976-153335ffcce0	Algodão hidrófilo	5	20	1	07-08-2025	10029	un	f
aae6d21d-809f-4a4d-ad63-ce707d617a39	Protetor Auricular	15	50	11	15-07-2025	10022	un	f
\.


--
-- Data for Name: n8n_chat_avb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.n8n_chat_avb (id, session_id, message) FROM stdin;
1	120363419821680910@g.us	{"type": "human", "content": "@559992305809 quais ferramentas temos disponível para pegar na ferramentaria?", "additional_kwargs": {}, "response_metadata": {}}
2	120363419821680910@g.us	{"type": "ai", "content": "Olá! Aqui está a lista de ferramentas disponíveis para empréstimo na ferramentaria AVB:\\n\\n1. **Alicate de pressão** - TAG: 00807253894 - Quantidade disponível: 1\\n2. **Alinhador de cilindros** - TAG: 00807253887 - Quantidade disponível: 1\\n3. **Base magnética** - TAG: 00807253904 - Quantidade disponível: 1\\n4. **Broca de aço rápido** - TAG: 00807253885 - Quantidade disponível: 1\\n5. **Calibrador de Eixo** - TAG: 00807253905 - Quantidade disponível: 1\\n6. **Carrinho de Ferramentas** - TAG: 00807253915 - Quantidade disponível: 1\\n7. **Cavalete Hidráulico** - TAG: 00807253901 - Quantidade disponível: 1\\n8. **Chave Allen Jogo** - TAG: 00807253892 - Quantidade disponível: 1\\n9. **Chave Combinada 13mm** - TAG: 00807253923 - Quantidade disponível: 1\\n10. **Chave de Impacto** - TAG: 00807253906 - Quantidade disponível: 1\\n11. **Chave de torque digital** - TAG: 00807253886 - Quantidade disponível: 1\\n12. **Chave Inglesa 12\\"** - TAG: 00807253916 - Quantidade disponível: 1\\n13. **Compressor Portátil** - TAG: 00807253910 - Quantidade disponível: 1\\n14. **Conjunto de Mancal** - TAG: 00807253903 - Quantidade disponível: 1\\n15. **Estilete Industrial** - TAG: 00807253922 - Quantidade disponível: 1\\n16. **Etiquetadora Manual** - TAG: 00807253913 - Quantidade disponível: 1\\n17. **Extrator de Rolamento** - TAG: 00807253902 - Quantidade disponível: 1\\n18. **Fixador de Guia** - TAG: 00807253899 - Quantidade disponível: 1\\n19. **Fresa CNC 12mm** - TAG: 00807253881 - Quantidade disponível: 1\\n20. **Furadeira de Bancada** - TAG: 00807253908 - Quantidade disponível: 1\\n21. **Furadeira de Bancada** - TAG: 00846532887 - Quantidade disponível: 1\\n22. **Gabarito de Montagem** - TAG: 00807253891 - Quantidade disponível: 1\\n23. **Kit Brocas Aço Rápido** - TAG: 00807253921 - Quantidade disponível: 1\\n24. **Kit Ferramental Padrão** - TAG: 00807253914 - Quantidade disponível: 1\\n25. **Lanterna de Inspeção LED** - TAG: 00807253925 - Quantidade disponível: 1\\n26. **Lixadeira Elétrica** - TAG: 00807253889 - Quantidade disponível: 1\\n27. **Mandril de Precisão** - TAG: 00807253882 - Quantidade disponível: 1\\n28. **Mandril Pneumático** - TAG: 00807253896 - Quantidade disponível: 1\\n29. **Martelo de Borracha** - TAG: 00807253893 - Quantidade disponível: 1\\n30. **Martelo Pena** - TAG: 00807253919 - Quantidade disponível: 1\\n31. **Medidor de Espessura** - TAG: 00807253900 - Quantidade disponível: 1\\n32. **Medidor de Torque** - TAG: 00807253883 - Quantidade disponível: 1\\n33. **Micrômetro de profundidade** - TAG: 00807253888 - Quantidade disponível: 1\\n34. **Morsa Giratória 5\\"** - TAG: 00807253924 - Quantidade disponível: 1\\n35. **Multímetro Digital** - TAG: 00807253909 - Quantidade disponível: 1\\n36. **Organizador de Ferramentas** - TAG: 00807253912 - Quantidade disponível: 1\\n37. **Paralelas Magnéticas** - TAG: 00807253898 - Quantidade disponível: 1\\n38. **Relógio Comparador** - TAG: 00807253917 - Quantidade disponível: 1\\n39. **Sapata de apoio** - TAG: 00807253890 - Quantidade disponível: 1\\n40. **Soquete Longo 19mm** - TAG: 00807253907 - Quantidade disponível: 1\\n41. **Suporte de Ferramentas** - TAG: 00807253884 - Quantidade disponível: 1\\n42. **Suporte de Solda** - TAG: 00807253895 - Quantidade disponível: 1\\n43. **Torquímetro Estalo** - TAG: 00807253920 - Quantidade disponível: 1\\n44. **Trena a Laser** - TAG: 00807253897 - Quantidade disponível: 1\\n\\nSe precisar de mais alguma informação ou ajuda, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
3	120363419821680910@g.us	{"type": "human", "content": "@559992305809 me traga o relatório de materiais que temos no estoque", "additional_kwargs": {}, "response_metadata": {}}
4	120363419821680910@g.us	{"type": "ai", "content": "Aqui está o relatório de materiais atualmente disponíveis no estoque:\\n\\n1. **Acetona** - Quantidade disponível: 9 - TAG: 10099\\n2. **Água Sanitária 5L** - Quantidade disponível: 5 - TAG: 10001\\n3. **Álcool isopropílico 1l** - Quantidade disponível: 10 - TAG: 10026\\n4. **Algodão hidrófilo** - Quantidade disponível: 19 - TAG: 10029\\n5. **Balde plástico 20l** - Quantidade disponível: 4 - TAG: 10002\\n6. **Caneta marcadora** - Quantidade disponível: 14 - TAG: 10015\\n7. **Cola tekbond 793** - Quantidade disponível: 5 - TAG: 10004\\n8. **Desengraxante Biodegradável** - Quantidade disponível: 8 - TAG: 10025\\n9. **Desengraxante em gel** - Quantidade disponível: 3 - TAG: 10003\\n10. **Desengripante Spray** - Quantidade disponível: 11 - TAG: 10021\\n11. **Detergente Neutro** - Quantidade disponível: 4 - TAG: 10007\\n12. **Esponja de Aço** - Quantidade disponível: 12 - TAG: 10023\\n13. **Estopa Industrial** - Quantidade disponível: 27 - TAG: 10016\\n14. **Fita Crepe 25mm** - Quantidade disponível: 14 - TAG: 10012\\n15. **Fita Dupla Face** - Quantidade disponível: 10 - TAG: 10027\\n16. **Fita isolante preta** - Quantidade disponível: 15 - TAG: 10028\\n17. **Flanela para Limpeza** - Quantidade disponível: 30 - TAG: 10010\\n18. **Graxa Azul** - Quantidade disponível: 4 - TAG: 10006\\n19. **Lixa d’água 220** - Quantidade disponível: 29 - TAG: 10024\\n20. **Luva de couro** - Quantidade disponível: 20 - TAG: 10084\\n21. **Luva de Raspa de Couro** - Quantidade disponível: 13 - TAG: 10020\\n22. **Marcador Permanente** - Quantidade disponível: 10 - TAG: 10019\\n23. **Máscara de pano** - Quantidade disponível: 70 - TAG: 10011\\n24. **Máscara PFF2** - Quantidade disponível: 22 - TAG: 10030\\n25. **Mascara química** - Quantidade disponível: 27 - TAG: 10065\\n26. **Pano de chão** - Quantidade disponível: 40 - TAG: 10013\\n27. **Papel Toalha Industrial** - Quantidade disponível: 17 - TAG: 10008\\n28. **Papelão Ondulado** - Quantidade disponível: 9 - TAG: 10014\\n29. **Protetor Auricular** - Quantidade disponível: 39 - TAG: 10022\\n30. **Rodo com cabo** - Quantidade disponível: 20 - TAG: 10017\\n31. **Silicone Spray** - Quantidade disponível: 8 - TAG: 10018\\n32. **Tinta spray** - Quantidade disponível: 4 - TAG: 10093\\n33. **Trapo de algodão** - Quantidade disponível: 16 - TAG: 10009\\n34. **WD-40 300ml** - Quantidade disponível: 9 - TAG: 10005\\n\\nSe precisar de mais detalhes ou ajuda, é só avisar!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
5	120363419821680910@g.us	{"type": "human", "content": "@559992305809 funcionário Alan tá com alguma ferramenta ?", "additional_kwargs": {}, "response_metadata": {}}
6	120363419821680910@g.us	{"type": "ai", "content": "O funcionário Alan Ferreira da Silva está atualmente com as seguintes ferramentas emprestadas:\\n\\n1. **Chave de Impacto**\\n   - TAG: 00807253906\\n   - Tipo: Elétrica\\n   - Data Emprestado: 10-08-2025\\n\\n2. **Compressor Portátil**\\n   - TAG: 00807253910\\n   - Tipo: Pneumática\\n   - Data Emprestado: 10-08-2025\\n\\nSe precisar de mais informações, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
7	120363419821680910@g.us	{"type": "human", "content": "@559992305809 alguém pegou alguma ferramenta hoje?", "additional_kwargs": {}, "response_metadata": {}}
8	120363419821680910@g.us	{"type": "ai", "content": "Hoje, até o momento, nenhuma ferramenta foi emprestada na ferramentaria AVB. Se precisar de mais alguma coisa, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
9	120363419821680910@g.us	{"type": "human", "content": "@559992305809 o funcionário Welington pegou alguma ferramenta?", "additional_kwargs": {}, "response_metadata": {}}
10	120363419821680910@g.us	{"type": "ai", "content": "O funcionário Welington Dias Campos pegou as seguintes ferramentas hoje:\\n\\n1. **Alicate de pressão**\\n   - TAG: 00807253894\\n   - Tipo: Manual\\n   - Data Emprestado: 13-08-2025\\n\\n2. **Broca de aço rápido**\\n   - TAG: 00807253885\\n   - Tipo: Corte\\n   - Data Emprestado: 13-08-2025\\n\\nSe precisar de mais alguma informação, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
11	120363419821680910@g.us	{"type": "human", "content": "@559992305809 alguém pegou alguma ferramenta hoje?", "additional_kwargs": {}, "response_metadata": {}}
12	120363419821680910@g.us	{"type": "ai", "content": "Hoje, no dia 13-08-2025, as seguintes ferramentas foram emprestadas na ferramentaria AVB:\\n\\n1. **Alicate de pressão**\\n   - TAG: 00807253894\\n   - Tipo: Manual\\n   - Funcionario: Welington Dias Campos\\n\\n2. **Broca de aço rápido**\\n   - TAG: 00807253885\\n   - Tipo: Corte\\n   - Funcionario: Welington Dias Campos\\n\\nSe precisar de mais informações, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
13	120363419821680910@g.us	{"type": "human", "content": "@559992305809 qual o estoque atual de materiais que temos?", "additional_kwargs": {}, "response_metadata": {}}
14	120363419821680910@g.us	{"type": "ai", "content": "Aqui está o estoque atual de materiais disponíveis na AVB:\\n\\n1. **Acetona** - Quantidade disponível: 9 - TAG: 10099\\n2. **Água Sanitária 5L** - Quantidade disponível: 5 - TAG: 10001\\n3. **Álcool isopropílico 1l** - Quantidade disponível: 10 - TAG: 10026\\n4. **Algodão hidrófilo** - Quantidade disponível: 19 - TAG: 10029\\n5. **Balde plástico 20l** - Quantidade disponível: 4 - TAG: 10002\\n6. **Caneta marcadora** - Quantidade disponível: 14 - TAG: 10015\\n7. **Cola tekbond 793** - Quantidade disponível: 5 - TAG: 10004\\n8. **Desengraxante Biodegradável** - Quantidade disponível: 8 - TAG: 10025\\n9. **Desengraxante em gel** - Quantidade disponível: 3 - TAG: 10003\\n10. **Desengripante Spray** - Quantidade disponível: 11 - TAG: 10021\\n11. **Detergente Neutro** - Quantidade disponível: 4 - TAG: 10007\\n12. **Esponja de Aço** - Quantidade disponível: 12 - TAG: 10023\\n13. **Estopa Industrial** - Quantidade disponível: 27 - TAG: 10016\\n14. **Fita Crepe 25mm** - Quantidade disponível: 14 - TAG: 10012\\n15. **Fita Dupla Face** - Quantidade disponível: 10 - TAG: 10027\\n16. **Fita isolante preta** - Quantidade disponível: 15 - TAG: 10028\\n17. **Flanela para Limpeza** - Quantidade disponível: 30 - TAG: 10010\\n18. **Graxa Azul** - Quantidade disponível: 4 - TAG: 10006\\n19. **Lixa d’água 220** - Quantidade disponível: 29 - TAG: 10024\\n20. **Luva de couro** - Quantidade disponível: 20 - TAG: 10084\\n21. **Luva de Raspa de Couro** - Quantidade disponível: 13 - TAG: 10020\\n22. **Marcador Permanente** - Quantidade disponível: 10 - TAG: 10019\\n23. **Máscara de pano** - Quantidade disponível: 70 - TAG: 10011\\n24. **Máscara PFF2** - Quantidade disponível: 22 - TAG: 10030\\n25. **Mascara química** - Quantidade disponível: 27 - TAG: 10065\\n26. **Pano de chão** - Quantidade disponível: 40 - TAG: 10013\\n27. **Papel Toalha Industrial** - Quantidade disponível: 17 - TAG: 10008\\n28. **Papelão Ondulado** - Quantidade disponível: 9 - TAG: 10014\\n29. **Protetor Auricular** - Quantidade disponível: 39 - TAG: 10022\\n30. **Rodo com cabo** - Quantidade disponível: 20 - TAG: 10017\\n31. **Silicone Spray** - Quantidade disponível: 8 - TAG: 10018\\n32. **Tinta spray** - Quantidade disponível: 4 - TAG: 10093\\n33. **Trapo de algodão** - Quantidade disponível: 16 - TAG: 10009\\n34. **WD-40 300ml** - Quantidade disponível: 9 - TAG: 10005\\n\\nSe precisar de mais informações ou ajuda, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
15	120363419821680910@g.us	{"type": "human", "content": "@559992305809 o funcionário Welington pegou alguma ferramenta?", "additional_kwargs": {}, "response_metadata": {}}
16	120363419821680910@g.us	{"type": "ai", "content": "O funcionário Welington Dias Campos pegou as seguintes ferramentas:\\n\\n1. **Alicate de pressão**\\n   - TAG: 00807253894\\n\\n2. **Broca de aço rápido**\\n   - TAG: 00807253885\\n\\n3. **Chave de Impacto**\\n   - TAG: 00807253906\\n\\nSe precisar de mais alguma informação, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
17	120363419821680910@g.us	{"type": "human", "content": "@559992305809 em quais dias ele pegou?", "additional_kwargs": {}, "response_metadata": {}}
18	120363419821680910@g.us	{"type": "ai", "content": "O funcionário Welington Dias Campos pegou as seguintes ferramentas nas datas indicadas:\\n\\n1. **Alicate de pressão**\\n   - Data emprestado: 13-08-2025\\n\\n2. **Broca de aço rápido**\\n   - Data emprestado: 13-08-2025\\n\\n3. **Chave de Impacto**\\n   - Data emprestado: 19-08-2025\\n\\nSe precisar de mais informações, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
19	120363419821680910@g.us	{"type": "human", "content": "@559992305809 quais ferramentas temos disponíveis e quais ferramentas estão emprestadas", "additional_kwargs": {}, "response_metadata": {}}
20	120363419821680910@g.us	{"type": "ai", "content": "Aqui está o status atual das ferramentas na ferramentaria AVB:\\n\\n### Ferramentas Disponíveis:\\n1. **Alinhador de cilindros** - TAG: 00807253887\\n2. **Base magnética** - TAG: 00807253904\\n3. **Calibrador de Eixo** - TAG: 00807253905\\n4. **Carrinho de Ferramentas** - TAG: 00807253915\\n5. **Cavalete Hidráulico** - TAG: 00807253901\\n6. **Chave Allen Jogo** - TAG: 00807253892\\n7. **Chave Combinada 13mm** - TAG: 00807253923\\n8. **Chave de torque digital** - TAG: 00807253886\\n9. **Chave Inglesa 12\\"** - TAG: 00807253916\\n10. **Compressor Portátil** - TAG: 00807253910\\n11. **Conjunto de Mancal** - TAG: 00807253903\\n12. **Estilete Industrial** - TAG: 00807253922\\n13. **Etiquetadora Manual** - TAG: 00807253913\\n14. **Extrator de Rolamento** - TAG: 00807253902\\n15. **Fixador de Guia** - TAG: 00807253899\\n16. **Fresa CNC 12mm** - TAG: 00807253881\\n17. **Furadeira** - TAG: 00987463874\\n18. **Furadeira de Bancada** - TAG: 00846532887\\n19. **Furadeira de Bancada** - TAG: 00807253908\\n20. **Gabarito de Montagem** - TAG: 00807253891\\n21. **Kit Brocas Aço Rápido** - TAG: 00807253921\\n22. **Kit Ferramental Padrão** - TAG: 00807253914\\n23. **Lanterna de Inspeção LED** - TAG: 00807253925\\n24. **Lixadeira Elétrica** - TAG: 00807253889\\n25. **Mandril de Precisão** - TAG: 00807253882\\n26. **Mandril Pneumático** - TAG: 00807253896\\n27. **Martelo de Borracha** - TAG: 00807253893\\n28. **Martelo Pena** - TAG: 00807253919\\n29. **Medidor de Espessura** - TAG: 00807253900\\n30. **Medidor de Torque** - TAG: 00807253883\\n31. **Micrômetro de profundidade** - TAG: 00807253888\\n32. **Morsa Giratória 5\\"** - TAG: 00807253924\\n33. **Multímetro Digital** - TAG: 00807253909\\n34. **Organizador de Ferramentas** - TAG: 00807253912\\n35. **Paquímetro Digital** - TAG: 00807253918\\n36. **Paralelas Magnéticas** - TAG: 00807253898\\n37. **Relógio Comparador** - TAG: 00807253917\\n38. **Sapata de apoio** - TAG: 00807253890\\n39. **Soquete Longo 19mm** - TAG: 00807253907\\n40. **Suporte de Ferramentas** - TAG: 00807253884\\n41. **Suporte de Solda** - TAG: 00807253895\\n42. **Torquímetro Estalo** - TAG: 00807253920\\n43. **Trena a Laser** - TAG: 00807253897\\n\\n### Ferramentas Emprestadas:\\n1. **Alicate de pressão** - TAG: 00807253894\\n2. **Broca de aço rápido** - TAG: 00807253885\\n3. **Chave de Impacto** - TAG: 00807253906\\n\\nSe precisar de mais informações ou ajuda, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
21	120363419821680910@g.us	{"type": "human", "content": "@559992305809 quais broca temos no estoque?", "additional_kwargs": {}, "response_metadata": {}}
22	120363419821680910@g.us	{"type": "ai", "content": "Atualmente, temos as seguintes brocas no estoque:\\n\\n1. **Broca de aço rápido**\\n   - TAG: 00807253885\\n   - Quantidade disponível: 0 (Emprestada)\\n\\n2. **Kit Brocas Aço Rápido**\\n   - TAG: 00807253921\\n   - Quantidade disponível: 1\\n\\nSe precisar de mais ajuda ou informações, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
23	120363419821680910@g.us	{"type": "human", "content": "@559992305809 quais ferramentas estão emprestadas?", "additional_kwargs": {}, "response_metadata": {}}
24	120363419821680910@g.us	{"type": "ai", "content": "Atualmente, as seguintes ferramentas estão emprestadas:\\n\\n1. **Alicate de pressão**\\n   - TAG: 00807253894\\n\\n2. **Broca de aço rápido**\\n   - TAG: 00807253885\\n\\n3. **Micrômetro de profundidade**\\n   - TAG: 00807253888\\n\\n4. **Suporte de Solda**\\n   - TAG: 00807253895\\n\\nSe precisar de mais informações ou ajuda, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
25	120363421705508817@g.us	{"type": "human", "content": "@559992305809  quais ferramentas estão emprestadas ?", "additional_kwargs": {}, "response_metadata": {}}
26	120363421705508817@g.us	{"type": "ai", "content": "Olá! Aqui está a lista das ferramentas que estão emprestadas no momento:\\n\\n1. **Alicate de pressão**\\n   - TAG: 00807253894\\n   - Quantidade Disponível: 0\\n\\n2. **Alinhador de cilindros**\\n   - TAG: 00807253887\\n   - Quantidade Disponível: 0\\n\\n3. **Base magnética**\\n   - TAG: 00807253904\\n   - Quantidade Disponível: 0\\n\\n4. **Broca de aço rápido**\\n   - TAG: 00807253885\\n   - Quantidade Disponível: 0\\n\\n5. **Calibrador de Eixo**\\n   - TAG: 00807253905\\n   - Quantidade Disponível: 0\\n\\n6. **Micrômetro de profundidade**\\n   - TAG: 00807253888\\n   - Quantidade Disponível: 0\\n\\n7. **Suporte de Solda**\\n   - TAG: 00807253895\\n   - Quantidade Disponível: 0\\n\\nSe precisar de mais alguma informação, estou à disposição!", "tool_calls": [], "additional_kwargs": {}, "response_metadata": {}, "invalid_tool_calls": []}
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, email, role, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: registro_mate_funcionarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_mate_funcionarios (id, funcionario, material, quantidade, data, matricula) FROM stdin;
e52a0d3f-8e33-4441-948b-cb111b0a80a1	WELINGTON DIAS CAMPOS	10014	3	15-08-2025	2345
0e8d819f-9584-4694-87a5-bcb2bcb48100	HELEN CRISTINA PEREIRA LIMA	10099	3	21-08-2025	13920
1eeaa2b2-6e07-4997-8616-3336e30ad070	ALAN FERREIRA DA SILVA	10023	4	15-08-2025	1234
2b4d4b4f-2c4c-479f-93e9-27cc45c3a83e	ALAN FERREIRA DA SILVA	10013	6	15-08-2025	1234
83af5169-d7c1-444b-8eff-37b7203e4ee0	ALAN FERREIRA DA SILVA	10011	2	15-08-2025	1234
8719eb9c-c9a0-4213-a80d-5513922b67ad	ALAN FERREIRA DA SILVA	10026	4	15-08-2025	1234
c4aa7f03-7400-45ed-bcf7-197284549260	WELINGTON DIAS CAMPOS	10023	4	15-08-2025	2345
bd6c1302-7350-4e21-b6a1-5a1d45ab0b65	WELINGTON DIAS CAMPOS	10013	6	15-08-2025	2345
5901e650-92b8-4ecc-8354-50940ffd0e3c	WELINGTON DIAS CAMPOS	10011	2	15-08-2025	2345
fe766902-847e-42fe-abbb-7c08d62bff38	WELINGTON DIAS CAMPOS	10026	4	15-08-2025	2345
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-07-23 22:25:18
20211116045059	2025-07-23 22:25:23
20211116050929	2025-07-23 22:25:26
20211116051442	2025-07-23 22:25:30
20211116212300	2025-07-23 22:25:34
20211116213355	2025-07-23 22:25:37
20211116213934	2025-07-23 22:25:40
20211116214523	2025-07-23 22:25:45
20211122062447	2025-07-23 22:25:48
20211124070109	2025-07-23 22:25:51
20211202204204	2025-07-23 22:25:55
20211202204605	2025-07-23 22:25:58
20211210212804	2025-07-23 22:26:09
20211228014915	2025-07-23 22:26:12
20220107221237	2025-07-23 22:26:15
20220228202821	2025-07-23 22:26:19
20220312004840	2025-07-23 22:26:22
20220603231003	2025-07-23 22:26:27
20220603232444	2025-07-23 22:26:31
20220615214548	2025-07-23 22:26:35
20220712093339	2025-07-23 22:26:38
20220908172859	2025-07-23 22:26:41
20220916233421	2025-07-23 22:26:45
20230119133233	2025-07-23 22:26:48
20230128025114	2025-07-23 22:26:53
20230128025212	2025-07-23 22:26:56
20230227211149	2025-07-23 22:26:59
20230228184745	2025-07-23 22:27:03
20230308225145	2025-07-23 22:27:06
20230328144023	2025-07-23 22:27:09
20231018144023	2025-07-23 22:27:13
20231204144023	2025-07-23 22:27:18
20231204144024	2025-07-23 22:27:22
20231204144025	2025-07-23 22:27:25
20240108234812	2025-07-23 22:27:29
20240109165339	2025-07-23 22:27:32
20240227174441	2025-07-23 22:27:38
20240311171622	2025-07-23 22:27:42
20240321100241	2025-07-23 22:27:50
20240401105812	2025-07-23 22:27:59
20240418121054	2025-07-23 22:28:04
20240523004032	2025-07-23 22:28:16
20240618124746	2025-07-23 22:28:19
20240801235015	2025-07-23 22:28:22
20240805133720	2025-07-23 22:28:26
20240827160934	2025-07-23 22:28:30
20240919163303	2025-07-23 22:28:38
20240919163305	2025-07-23 22:28:43
20241019105805	2025-07-23 22:28:48
20241030150047	2025-07-23 22:29:01
20241108114728	2025-07-23 22:29:05
20241121104152	2025-07-23 22:29:09
20241130184212	2025-07-23 22:29:13
20241220035512	2025-07-23 22:29:16
20241220123912	2025-07-23 22:29:19
20241224161212	2025-07-23 22:29:23
20250107150512	2025-07-23 22:29:26
20250110162412	2025-07-23 22:29:29
20250123174212	2025-07-23 22:29:33
20250128220012	2025-07-23 22:29:36
20250506224012	2025-07-23 22:29:39
20250523164012	2025-07-23 22:29:42
20250714121412	2025-07-23 22:29:45
20250905041441	2025-09-26 17:07:46
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-23 22:25:14.562524
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-23 22:25:14.571687
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-23 22:25:14.5796
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-23 22:25:14.6032
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-23 22:25:14.620639
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-23 22:25:14.628896
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-23 22:25:14.638991
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-23 22:25:14.647169
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-23 22:25:14.654933
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-23 22:25:14.662736
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-23 22:25:14.67096
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-23 22:25:14.679412
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-23 22:25:14.695931
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-23 22:25:14.704215
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-23 22:25:14.712719
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-23 22:25:14.735501
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-23 22:25:14.74433
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-23 22:25:14.751922
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-23 22:25:14.75999
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-23 22:25:14.771332
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-23 22:25:14.784673
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-23 22:25:14.796056
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-23 22:25:14.811451
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-23 22:25:14.82831
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-23 22:25:14.836279
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-23 22:25:14.844498
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-26 19:13:00.814249
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-26 19:13:01.420616
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-26 19:13:01.52649
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-26 19:13:01.657797
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-26 19:13:01.711618
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-26 19:13:01.719981
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-26 19:13:01.812015
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-26 19:13:01.938872
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-26 19:13:01.972398
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-26 19:13:02.118891
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-26 19:13:02.154353
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-26 19:13:02.295079
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-26 19:13:02.31576
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key) FROM stdin;
20250724101356	{"\n-- Verificar se RLS está ativo na tabela ferramentas\nSELECT schemaname, tablename, rowsecurity \nFROM pg_tables \nWHERE tablename = 'ferramentas';\n\n-- Verificar políticas RLS existentes\nSELECT * FROM pg_policies WHERE tablename = 'ferramentas';\n\n-- Desabilitar temporariamente RLS para permitir acesso público aos dados\nALTER TABLE public.ferramentas DISABLE ROW LEVEL SECURITY;\n"}		agencialovable@gmail.com	\N
20250724102358	{"\n-- Habilitar RLS na tabela materiais\nALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;\n\n-- Criar política para permitir SELECT público na tabela materiais\nCREATE POLICY \\"Enable read access for all users\\" ON public.materiais\nFOR SELECT USING (true);\n\n-- Criar política para permitir INSERT público na tabela materiais\nCREATE POLICY \\"Enable insert access for all users\\" ON public.materiais\nFOR INSERT WITH CHECK (true);\n\n-- Criar política para permitir UPDATE público na tabela materiais\nCREATE POLICY \\"Enable update access for all users\\" ON public.materiais\nFOR UPDATE USING (true);\n\n-- Criar política para permitir DELETE público na tabela materiais\nCREATE POLICY \\"Enable delete access for all users\\" ON public.materiais\nFOR DELETE USING (true);\n"}		agencialovable@gmail.com	\N
20250724102818	{"\n-- Habilitar RLS na tabela funcionarios\nALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;\n\n-- Criar política para permitir SELECT público na tabela funcionarios\nCREATE POLICY \\"Enable read access for all users\\" ON public.funcionarios\nFOR SELECT USING (true);\n\n-- Criar política para permitir INSERT público na tabela funcionarios\nCREATE POLICY \\"Enable insert access for all users\\" ON public.funcionarios\nFOR INSERT WITH CHECK (true);\n\n-- Criar política para permitir UPDATE público na tabela funcionarios\nCREATE POLICY \\"Enable update access for all users\\" ON public.funcionarios\nFOR UPDATE USING (true);\n\n-- Criar política para permitir DELETE público na tabela funcionarios\nCREATE POLICY \\"Enable delete access for all users\\" ON public.funcionarios\nFOR DELETE USING (true);\n"}		agencialovable@gmail.com	\N
20250725020055	{"\n-- Remover tabelas existentes se houver\nDROP TABLE IF EXISTS public.funcionarios CASCADE;\nDROP TABLE IF EXISTS public.materiais CASCADE;\nDROP TABLE IF EXISTS public.ferramentas CASCADE;\n\n-- Criar tabela funcionarios\nCREATE TABLE public.funcionarios (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nome TEXT NOT NULL,\n  matricula INTEGER NOT NULL UNIQUE,\n  setor TEXT NOT NULL,\n  numero_whatsapp TEXT,\n  posse_ferramentas JSONB DEFAULT '[]'::jsonb,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Criar tabela ferramentas\nCREATE TABLE public.ferramentas (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nome TEXT NOT NULL,\n  tag TEXT NOT NULL UNIQUE,\n  quantidade INTEGER NOT NULL DEFAULT 0,\n  saiu INTEGER NOT NULL DEFAULT 0,\n  categoria TEXT NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Criar tabela materiais\nCREATE TABLE public.materiais (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  nome TEXT NOT NULL,\n  tag TEXT NOT NULL UNIQUE,\n  quantidade_minima INTEGER NOT NULL DEFAULT 0,\n  entrada INTEGER NOT NULL DEFAULT 0,\n  saida INTEGER NOT NULL DEFAULT 0,\n  data_entrada_estoque TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  unidade TEXT DEFAULT 'un',\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Habilitar RLS nas tabelas\nALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;\n\n-- Políticas para funcionarios (acesso público para leitura e escrita)\nCREATE POLICY \\"Permitir leitura de funcionários\\" \n  ON public.funcionarios \n  FOR SELECT \n  USING (true);\n\nCREATE POLICY \\"Permitir inserção de funcionários\\" \n  ON public.funcionarios \n  FOR INSERT \n  WITH CHECK (true);\n\nCREATE POLICY \\"Permitir atualização de funcionários\\" \n  ON public.funcionarios \n  FOR UPDATE \n  USING (true);\n\nCREATE POLICY \\"Permitir exclusão de funcionários\\" \n  ON public.funcionarios \n  FOR DELETE \n  USING (true);\n\n-- Políticas para ferramentas (acesso público para leitura e escrita)\nCREATE POLICY \\"Permitir leitura de ferramentas\\" \n  ON public.ferramentas \n  FOR SELECT \n  USING (true);\n\nCREATE POLICY \\"Permitir inserção de ferramentas\\" \n  ON public.ferramentas \n  FOR INSERT \n  WITH CHECK (true);\n\nCREATE POLICY \\"Permitir atualização de ferramentas\\" \n  ON public.ferramentas \n  FOR UPDATE \n  USING (true);\n\nCREATE POLICY \\"Permitir exclusão de ferramentas\\" \n  ON public.ferramentas \n  FOR DELETE \n  USING (true);\n\n-- Políticas para materiais (acesso público para leitura e escrita)\nCREATE POLICY \\"Permitir leitura de materiais\\" \n  ON public.materiais \n  FOR SELECT \n  USING (true);\n\nCREATE POLICY \\"Permitir inserção de materiais\\" \n  ON public.materiais \n  FOR INSERT \n  WITH CHECK (true);\n\nCREATE POLICY \\"Permitir atualização de materiais\\" \n  ON public.materiais \n  FOR UPDATE \n  USING (true);\n\nCREATE POLICY \\"Permitir exclusão de materiais\\" \n  ON public.materiais \n  FOR DELETE \n  USING (true);\n\n-- Criar índices para melhor performance\nCREATE INDEX idx_funcionarios_matricula ON public.funcionarios(matricula);\nCREATE INDEX idx_ferramentas_tag ON public.ferramentas(tag);\nCREATE INDEX idx_materiais_tag ON public.materiais(tag);\n\n-- Inserir alguns dados de exemplo\nINSERT INTO public.funcionarios (nome, matricula, setor, numero_whatsapp) VALUES \n('João Silva', 13812, 'Manutenção', '11999999999'),\n('Maria Santos', 13813, 'Produção', '11888888888'),\n('Carlos Oliveira', 13814, 'Qualidade', '11777777777');\n\nINSERT INTO public.ferramentas (nome, tag, quantidade, saiu, categoria) VALUES \n('Martelo', 'MAR001', 5, 2, 'Ferramentas Manuais'),\n('Chave de Fenda', 'CHV001', 10, 1, 'Ferramentas Manuais'),\n('Furadeira', 'FUR001', 3, 1, 'Ferramentas Elétricas'),\n('Alicate', 'ALI001', 8, 0, 'Ferramentas Manuais');\n\nINSERT INTO public.materiais (nome, tag, quantidade_minima, entrada, saida, unidade) VALUES \n('Parafuso M6', 'PAR001', 100, 500, 120, 'un'),\n('Porca M6', 'POR001', 50, 300, 80, 'un'),\n('Arruela', 'ARR001', 200, 1000, 300, 'un'),\n('Fita Isolante', 'FIT001', 10, 50, 35, 'un');\n"}		agencialovable@gmail.com	\N
20250726015237	{"\n-- Add the caracteristicas column to the ferramentas table\nALTER TABLE public.ferramentas \nADD COLUMN IF NOT EXISTS caracteristicas jsonb DEFAULT '{}'::jsonb;\n"}		agencialovable@gmail.com	\N
20250815035039	{"\n-- Habilitar RLS na tabela registro_mate_funcionarios\nALTER TABLE public.registro_mate_funcionarios ENABLE ROW LEVEL SECURITY;\n\n-- Política para permitir leitura de todos os registros de materiais\nCREATE POLICY \\"Permitir leitura de registros de materiais\\" \nON public.registro_mate_funcionarios\nFOR SELECT \nTO authenticated, anon\nUSING (true);\n\n-- Política para permitir inserção de registros de materiais\nCREATE POLICY \\"Permitir inserção de registros de materiais\\" \nON public.registro_mate_funcionarios\nFOR INSERT \nTO authenticated, anon\nWITH CHECK (true);\n\n-- Política para permitir atualização de registros de materiais\nCREATE POLICY \\"Permitir atualização de registros de materiais\\" \nON public.registro_mate_funcionarios\nFOR UPDATE \nTO authenticated, anon\nUSING (true);\n\n-- Política para permitir exclusão de registros de materiais\nCREATE POLICY \\"Permitir exclusão de registros de materiais\\" \nON public.registro_mate_funcionarios\nFOR DELETE \nTO authenticated, anon\nUSING (true);\n"}		agencialovable@gmail.com	\N
20250819122037	{"\n-- Verificar se RLS está habilitado na tabela ferramentas\n-- Se estiver, vamos criar políticas mais permissivas para leitura\n\n-- Desabilitar RLS temporariamente para debug (se existir)\nALTER TABLE public.ferramentas DISABLE ROW LEVEL SECURITY;\n\n-- Ou se preferir manter RLS, criar política permissiva para SELECT\n-- ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;\n-- \n-- -- Criar política que permite leitura de todas as ferramentas\n-- CREATE POLICY \\"Allow read access to ferramentas\\" \n--   ON public.ferramentas \n--   FOR SELECT \n--   USING (true);\n"}		agencialovable@gmail.com	\N
20250821082225	{"-- Fix security vulnerabilities by implementing proper RLS policies\n\n-- Drop existing overly permissive policies for funcionarios table\nDROP POLICY IF EXISTS \\"Permitir leitura de funcionários\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Permitir inserção de funcionários\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Permitir atualização de funcionários\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Permitir exclusão de funcionários\\" ON public.funcionarios;\n\n-- Drop existing overly permissive policies for ferramentas table\nDROP POLICY IF EXISTS \\"Permitir leitura de ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Permitir inserção de ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Permitir atualização de ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Permitir exclusão de ferramentas\\" ON public.ferramentas;\n\n-- Drop existing overly permissive policies for materiais table\nDROP POLICY IF EXISTS \\"Permitir leitura de materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Permitir inserção de materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Permitir atualização de materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Permitir exclusão de materiais\\" ON public.materiais;\n\n-- Drop existing overly permissive policies for registro_mate_funcionarios table\nDROP POLICY IF EXISTS \\"Permitir leitura de registros de materiais\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Permitir inserção de registros de materiais\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Permitir atualização de registros de materiais\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Permitir exclusão de registros de materiais\\" ON public.registro_mate_funcionarios;\n\n-- Create secure RLS policies for funcionarios table\n-- Only authenticated users can view employee data\nCREATE POLICY \\"Authenticated users can view funcionarios\\"\nON public.funcionarios\nFOR SELECT\nUSING (auth.role() = 'authenticated');\n\n-- Only authenticated users can insert new employees\nCREATE POLICY \\"Authenticated users can insert funcionarios\\"\nON public.funcionarios\nFOR INSERT\nWITH CHECK (auth.role() = 'authenticated');\n\n-- Only authenticated users can update employee data\nCREATE POLICY \\"Authenticated users can update funcionarios\\"\nON public.funcionarios\nFOR UPDATE\nUSING (auth.role() = 'authenticated');\n\n-- Only authenticated users can delete employees\nCREATE POLICY \\"Authenticated users can delete funcionarios\\"\nON public.funcionarios\nFOR DELETE\nUSING (auth.role() = 'authenticated');\n\n-- Create secure RLS policies for ferramentas table\nCREATE POLICY \\"Authenticated users can view ferramentas\\"\nON public.ferramentas\nFOR SELECT\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can insert ferramentas\\"\nON public.ferramentas\nFOR INSERT\nWITH CHECK (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can update ferramentas\\"\nON public.ferramentas\nFOR UPDATE\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can delete ferramentas\\"\nON public.ferramentas\nFOR DELETE\nUSING (auth.role() = 'authenticated');\n\n-- Create secure RLS policies for materiais table\nCREATE POLICY \\"Authenticated users can view materiais\\"\nON public.materiais\nFOR SELECT\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can insert materiais\\"\nON public.materiais\nFOR INSERT\nWITH CHECK (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can update materiais\\"\nON public.materiais\nFOR UPDATE\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can delete materiais\\"\nON public.materiais\nFOR DELETE\nUSING (auth.role() = 'authenticated');\n\n-- Create secure RLS policies for registro_mate_funcionarios table\nCREATE POLICY \\"Authenticated users can view material usage records\\"\nON public.registro_mate_funcionarios\nFOR SELECT\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can insert material usage records\\"\nON public.registro_mate_funcionarios\nFOR INSERT\nWITH CHECK (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can update material usage records\\"\nON public.registro_mate_funcionarios\nFOR UPDATE\nUSING (auth.role() = 'authenticated');\n\nCREATE POLICY \\"Authenticated users can delete material usage records\\"\nON public.registro_mate_funcionarios\nFOR DELETE\nUSING (auth.role() = 'authenticated');"}		agencialovable@gmail.com	\N
20250821082954	{"\n-- Ajustar as políticas RLS para permitir acesso aos dados\n-- Removendo as políticas muito restritivas e criando novas mais permissivas\n\n-- Remover políticas existentes da tabela funcionarios\nDROP POLICY IF EXISTS \\"Authenticated users can view funcionarios\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can insert funcionarios\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can update funcionarios\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can delete funcionarios\\" ON public.funcionarios;\n\n-- Remover políticas existentes da tabela ferramentas\nDROP POLICY IF EXISTS \\"Authenticated users can view ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Authenticated users can insert ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Authenticated users can update ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Authenticated users can delete ferramentas\\" ON public.ferramentas;\n\n-- Remover políticas existentes da tabela materiais\nDROP POLICY IF EXISTS \\"Authenticated users can view materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Authenticated users can insert materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Authenticated users can update materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Authenticated users can delete materiais\\" ON public.materiais;\n\n-- Remover políticas existentes da tabela registro_mate_funcionarios\nDROP POLICY IF EXISTS \\"Authenticated users can view material usage records\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can insert material usage records\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can update material usage records\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can delete material usage records\\" ON public.registro_mate_funcionarios;\n\n-- Criar políticas mais permissivas para funcionarios\nCREATE POLICY \\"Allow all operations on funcionarios\\" ON public.funcionarios FOR ALL USING (true);\n\n-- Criar políticas mais permissivas para ferramentas\nCREATE POLICY \\"Allow all operations on ferramentas\\" ON public.ferramentas FOR ALL USING (true);\n\n-- Criar políticas mais permissivas para materiais\nCREATE POLICY \\"Allow all operations on materiais\\" ON public.materiais FOR ALL USING (true);\n\n-- Criar políticas mais permissivas para registro_mate_funcionarios\nCREATE POLICY \\"Allow all operations on registro_mate_funcionarios\\" ON public.registro_mate_funcionarios FOR ALL USING (true);\n"}		agencialovable@gmail.com	\N
20250902045643	{"-- Primeiro, vamos criar uma tabela de perfis de usuários\nCREATE TABLE public.profiles (\n  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  email TEXT NOT NULL,\n  role TEXT NOT NULL DEFAULT 'user',\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  PRIMARY KEY (id)\n);\n\n-- Enable RLS na tabela profiles\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\n-- Política para profiles: usuários podem ver seu próprio perfil\nCREATE POLICY \\"Users can view own profile\\" \nON public.profiles \nFOR SELECT \nUSING (auth.uid() = id);\n\n-- Política para profiles: usuários podem atualizar seu próprio perfil\nCREATE POLICY \\"Users can update own profile\\" \nON public.profiles \nFOR UPDATE \nUSING (auth.uid() = id);\n\n-- Função para criar perfil automaticamente\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nBEGIN\n  INSERT INTO public.profiles (id, email, role)\n  VALUES (new.id, new.email, 'admin');\n  RETURN new;\nEND;\n$$;\n\n-- Trigger para criar perfil quando usuário se registra\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();\n\n-- Função para verificar se usuário está autenticado\nCREATE OR REPLACE FUNCTION public.is_authenticated()\nRETURNS BOOLEAN\nLANGUAGE SQL\nSECURITY DEFINER\nSTABLE\nSET search_path = public\nAS $$\n  SELECT auth.uid() IS NOT NULL;\n$$;\n\n-- Agora vamos atualizar as políticas das tabelas existentes\n-- Remover políticas antigas\nDROP POLICY IF EXISTS \\"Allow all operations on funcionarios\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Allow all operations on ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Allow all operations on materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Allow all operations on registro_mate_funcionarios\\" ON public.registro_mate_funcionarios;\n\n-- Criar políticas seguras para funcionarios\nCREATE POLICY \\"Authenticated users can view funcionarios\\" \nON public.funcionarios \nFOR SELECT \nUSING (public.is_authenticated());\n\nCREATE POLICY \\"Authenticated users can manage funcionarios\\" \nON public.funcionarios \nFOR ALL \nUSING (public.is_authenticated());\n\n-- Criar políticas seguras para ferramentas\nCREATE POLICY \\"Authenticated users can view ferramentas\\" \nON public.ferramentas \nFOR SELECT \nUSING (public.is_authenticated());\n\nCREATE POLICY \\"Authenticated users can manage ferramentas\\" \nON public.ferramentas \nFOR ALL \nUSING (public.is_authenticated());\n\n-- Criar políticas seguras para materiais\nCREATE POLICY \\"Authenticated users can view materiais\\" \nON public.materiais \nFOR SELECT \nUSING (public.is_authenticated());\n\nCREATE POLICY \\"Authenticated users can manage materiais\\" \nON public.materiais \nFOR ALL \nUSING (public.is_authenticated());\n\n-- Criar políticas seguras para registro_mate_funcionarios\nCREATE POLICY \\"Authenticated users can view registro_mate_funcionarios\\" \nON public.registro_mate_funcionarios \nFOR SELECT \nUSING (public.is_authenticated());\n\nCREATE POLICY \\"Authenticated users can manage registro_mate_funcionarios\\" \nON public.registro_mate_funcionarios \nFOR ALL \nUSING (public.is_authenticated());\n\n-- Corrigir search_path das funções existentes\nCREATE OR REPLACE FUNCTION public.atualizar_estoque_baixo()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path = public\nAS $function$\nDECLARE\n  novo_estoque_baixo BOOLEAN;\nBEGIN\n  -- Calcula se o estoque está baixo\n  novo_estoque_baixo := (NEW.entrada - NEW.saida) <= NEW.quantidade_minima;\n\n  -- Atualiza a coluna estoque_baixo\n  NEW.estoque_baixo := novo_estoque_baixo;\n\n  -- Se o novo estoque_baixo for true e antes era false, envia para o webhook\n  IF novo_estoque_baixo = TRUE AND (OLD.estoque_baixo IS DISTINCT FROM TRUE) THEN\n    PERFORM http_post(\n      'https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/estoque-baixo',\n      'application/json',\n      json_build_object(\n        'id', NEW.id,\n        'entrada', NEW.entrada,\n        'saida', NEW.saida,\n        'quantidade_minima', NEW.quantidade_minima,\n        'estoque_baixo', TRUE\n      )::text\n    );\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$;\n\nCREATE OR REPLACE FUNCTION public.search_materiais(p_nome character varying DEFAULT NULL::character varying, p_tag numeric DEFAULT NULL::numeric, p_quant integer DEFAULT NULL::integer, p_data_entrada text DEFAULT NULL::text, p_estoque_baixo boolean DEFAULT NULL::boolean)\n RETURNS TABLE(nome text, quantidade_disponivel integer, tag numeric)\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path = public\nAS $function$\nBEGIN\n    RETURN QUERY\n    SELECT\n        m.nome,\n        (COALESCE(m.entrada, 0) - COALESCE(m.saida, 0))::INTEGER AS quantidade_disponivel,\n        m.tag\n    FROM materiais m\n    WHERE\n        (p_nome IS NULL OR unaccent(m.nome) ILIKE '%' || unaccent(p_nome) || '%')\n        AND (p_tag IS NULL OR m.tag = p_tag)\n        AND (p_data_entrada IS NULL OR m.data_entrada_estoque ILIKE '%' || p_data_entrada || '%')\n        AND (p_quant IS NULL OR (m.entrada - m.saida) = p_quant)\n        AND (p_estoque_baixo IS NULL OR m.estoque_baixo = p_estoque_baixo)\n    ORDER BY m.nome ASC;\nEND;\n$function$;\n\nCREATE OR REPLACE FUNCTION public.search_tools(p_nome character varying DEFAULT NULL::character varying, p_tipo character varying DEFAULT NULL::character varying, p_status character varying DEFAULT NULL::character varying, p_quant integer DEFAULT NULL::integer, p_tag character varying DEFAULT NULL::character varying, p_caracteristicas text[] DEFAULT NULL::text[], p_funcionario text DEFAULT NULL::text, p_matricula numeric DEFAULT NULL::numeric, p_data_emprestado text DEFAULT NULL::text, p_reserva boolean DEFAULT NULL::boolean, p_matricula_reserva text DEFAULT NULL::text, p_detalhado boolean DEFAULT false)\n RETURNS TABLE(nome text, tag text, quantidade_disponivel integer, tipo text, status text, quantidade_total integer, caracteristicas jsonb, id uuid, funcionario_emprestado text, matricula numeric, data_emprestado text, reserva boolean, matricula_reserva text)\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path = public\nAS $function$\nBEGIN\n    IF p_detalhado THEN\n        RETURN QUERY\n        SELECT \n            f.nome,\n            f.tag,\n            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,\n            f.categoria AS tipo,\n            f.status,\n            COALESCE(f.quantidade, 0)::INTEGER AS quantidade_total,\n            f.caracteristicas,\n            f.id,\n            f.funcionario_emprestado,\n            f.matricula,\n            f.data_emprestado,\n            f.reserva,\n            f.matricula_reserva\n        FROM ferramentas f\n        WHERE\n            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')\n            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))\n            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))\n            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))\n            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')\n            AND (p_matricula IS NULL OR f.matricula = p_matricula)\n            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')\n            AND (p_reserva IS NULL OR f.reserva = p_reserva)\n            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')\n            AND (\n                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant\n            )\n            AND (\n                p_caracteristicas IS NULL OR (\n                    array_length(p_caracteristicas, 1) > 0 AND\n                    EXISTS (\n                        SELECT 1\n                        FROM unnest(p_caracteristicas) AS c\n                        WHERE EXISTS (\n                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv\n                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'\n                        )\n                    )\n                )\n            )\n        ORDER BY f.nome ASC;\n\n    ELSE\n        RETURN QUERY\n        SELECT \n            f.nome,\n            f.tag,\n            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,\n            NULL::TEXT AS tipo,\n            NULL::TEXT AS status,\n            NULL::INTEGER AS quantidade_total,\n            NULL::JSONB AS caracteristicas,\n            NULL::UUID AS id,\n            NULL::TEXT AS funcionario_emprestado,\n            NULL::NUMERIC AS matricula,\n            NULL::TEXT AS data_emprestado,\n            NULL::BOOLEAN AS reserva,\n            NULL::TEXT AS matricula_reserva\n        FROM ferramentas f\n        WHERE\n            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')\n            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))\n            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))\n            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))\n            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')\n            AND (p_matricula IS NULL OR f.matricula = p_matricula)\n            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')\n            AND (p_reserva IS NULL OR f.reserva = p_reserva)\n            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')\n            AND (\n                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant\n            )\n            AND (\n                p_caracteristicas IS NULL OR (\n                    array_length(p_caracteristicas, 1) > 0 AND\n                    EXISTS (\n                        SELECT 1\n                        FROM unnest(p_caracteristicas) AS c\n                        WHERE EXISTS (\n                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv\n                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'\n                        )\n                    )\n                )\n            )\n        ORDER BY f.nome ASC;\n    END IF;\nEND;\n$function$;"}		agencialovable@gmail.com	\N
20250902045823	{"-- Corrigir a tabela n8n_chat_avb que estava sem políticas RLS\nCREATE POLICY \\"Authenticated users can manage n8n_chat_avb\\" \nON public.n8n_chat_avb \nFOR ALL \nUSING (public.is_authenticated());"}		agencialovable@gmail.com	\N
20250902050151	{"-- Remover políticas restritivas e criar políticas mais permissivas para permitir acesso aos dados\n\n-- Remover políticas existentes para funcionarios\nDROP POLICY IF EXISTS \\"Authenticated users can view funcionarios\\" ON public.funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can manage funcionarios\\" ON public.funcionarios;\n\n-- Remover políticas existentes para ferramentas\nDROP POLICY IF EXISTS \\"Authenticated users can view ferramentas\\" ON public.ferramentas;\nDROP POLICY IF EXISTS \\"Authenticated users can manage ferramentas\\" ON public.ferramentas;\n\n-- Remover políticas existentes para materiais\nDROP POLICY IF EXISTS \\"Authenticated users can view materiais\\" ON public.materiais;\nDROP POLICY IF EXISTS \\"Authenticated users can manage materiais\\" ON public.materiais;\n\n-- Remover políticas existentes para registro_mate_funcionarios\nDROP POLICY IF EXISTS \\"Authenticated users can view registro_mate_funcionarios\\" ON public.registro_mate_funcionarios;\nDROP POLICY IF EXISTS \\"Authenticated users can manage registro_mate_funcionarios\\" ON public.registro_mate_funcionarios;\n\n-- Criar políticas permissivas que permitem acesso público\n\n-- Políticas para funcionarios\nCREATE POLICY \\"Allow all operations on funcionarios\\" \nON public.funcionarios \nFOR ALL \nUSING (true);\n\n-- Políticas para ferramentas\nCREATE POLICY \\"Allow all operations on ferramentas\\" \nON public.ferramentas \nFOR ALL \nUSING (true);\n\n-- Políticas para materiais\nCREATE POLICY \\"Allow all operations on materiais\\" \nON public.materiais \nFOR ALL \nUSING (true);\n\n-- Políticas para registro_mate_funcionarios\nCREATE POLICY \\"Allow all operations on registro_mate_funcionarios\\" \nON public.registro_mate_funcionarios \nFOR ALL \nUSING (true);"}		agencialovable@gmail.com	\N
20250915075125	{"-- Atualizar função que contém webhook para novo domínio\nCREATE OR REPLACE FUNCTION public.atualizar_estoque_baixo()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nDECLARE\n  novo_estoque_baixo BOOLEAN;\nBEGIN\n  -- Calcula se o estoque está baixo\n  novo_estoque_baixo := (NEW.entrada - NEW.saida) <= NEW.quantidade_minima;\n\n  -- Atualiza a coluna estoque_baixo\n  NEW.estoque_baixo := novo_estoque_baixo;\n\n  -- Se o novo estoque_baixo for true e antes era false, envia para o webhook\n  IF novo_estoque_baixo = TRUE AND (OLD.estoque_baixo IS DISTINCT FROM TRUE) THEN\n    PERFORM http_post(\n      'https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/estoque-baixo',\n      'application/json',\n      json_build_object(\n        'id', NEW.id,\n        'entrada', NEW.entrada,\n        'saida', NEW.saida,\n        'quantidade_minima', NEW.quantidade_minima,\n        'estoque_baixo', TRUE\n      )::text\n    );\n  END IF;\n\n  RETURN NEW;\nEND;\n$function$"}		agencialovable@gmail.com	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: n8n_chat_avb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.n8n_chat_avb_id_seq', 26, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ferramentas ferramentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferramentas
    ADD CONSTRAINT ferramentas_pkey PRIMARY KEY (id);


--
-- Name: ferramentas ferramentas_tag_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferramentas
    ADD CONSTRAINT ferramentas_tag_key UNIQUE (tag);


--
-- Name: funcionarios funcionarios_cod_nfc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_cod_nfc_key UNIQUE (cod_nfc);


--
-- Name: funcionarios funcionarios_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_matricula_key UNIQUE (matricula);


--
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (id);


--
-- Name: materiais materiais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiais
    ADD CONSTRAINT materiais_pkey PRIMARY KEY (id);


--
-- Name: materiais materiais_tag_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiais
    ADD CONSTRAINT materiais_tag_key UNIQUE (tag);


--
-- Name: n8n_chat_avb n8n_chat_avb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.n8n_chat_avb
    ADD CONSTRAINT n8n_chat_avb_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: registro_mate_funcionarios registro_mate_funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_mate_funcionarios
    ADD CONSTRAINT registro_mate_funcionarios_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_ferramentas_tag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ferramentas_tag ON public.ferramentas USING btree (tag);


--
-- Name: idx_funcionarios_matricula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_funcionarios_matricula ON public.funcionarios USING btree (matricula);


--
-- Name: idx_registro_mate_funcionarios; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_registro_mate_funcionarios ON public.registro_mate_funcionarios USING btree (matricula, material);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: materiais trigger_estoque_baixo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_estoque_baixo BEFORE UPDATE OF entrada, saida, quantidade_minima ON public.materiais FOR EACH ROW EXECUTE FUNCTION public.atualizar_estoque_baixo();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: ferramentas Allow all operations on ferramentas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all operations on ferramentas" ON public.ferramentas USING (true);


--
-- Name: funcionarios Allow all operations on funcionarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all operations on funcionarios" ON public.funcionarios USING (true);


--
-- Name: materiais Allow all operations on materiais; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all operations on materiais" ON public.materiais USING (true);


--
-- Name: registro_mate_funcionarios Allow all operations on registro_mate_funcionarios; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow all operations on registro_mate_funcionarios" ON public.registro_mate_funcionarios USING (true);


--
-- Name: n8n_chat_avb Authenticated users can manage n8n_chat_avb; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can manage n8n_chat_avb" ON public.n8n_chat_avb USING (public.is_authenticated());


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: ferramentas; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;

--
-- Name: funcionarios; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

--
-- Name: materiais; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

--
-- Name: n8n_chat_avb; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.n8n_chat_avb ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: registro_mate_funcionarios; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.registro_mate_funcionarios ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION atualizar_estoque_baixo(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.atualizar_estoque_baixo() TO anon;
GRANT ALL ON FUNCTION public.atualizar_estoque_baixo() TO authenticated;
GRANT ALL ON FUNCTION public.atualizar_estoque_baixo() TO service_role;


--
-- Name: FUNCTION bytea_to_text(data bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.bytea_to_text(data bytea) TO postgres;
GRANT ALL ON FUNCTION public.bytea_to_text(data bytea) TO anon;
GRANT ALL ON FUNCTION public.bytea_to_text(data bytea) TO authenticated;
GRANT ALL ON FUNCTION public.bytea_to_text(data bytea) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION http(request public.http_request); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http(request public.http_request) TO postgres;
GRANT ALL ON FUNCTION public.http(request public.http_request) TO anon;
GRANT ALL ON FUNCTION public.http(request public.http_request) TO authenticated;
GRANT ALL ON FUNCTION public.http(request public.http_request) TO service_role;


--
-- Name: FUNCTION http_delete(uri character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_delete(uri character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_delete(uri character varying) TO anon;
GRANT ALL ON FUNCTION public.http_delete(uri character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_delete(uri character varying) TO service_role;


--
-- Name: FUNCTION http_delete(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying) TO anon;
GRANT ALL ON FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying) TO service_role;


--
-- Name: FUNCTION http_get(uri character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_get(uri character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_get(uri character varying) TO anon;
GRANT ALL ON FUNCTION public.http_get(uri character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_get(uri character varying) TO service_role;


--
-- Name: FUNCTION http_get(uri character varying, data jsonb); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_get(uri character varying, data jsonb) TO postgres;
GRANT ALL ON FUNCTION public.http_get(uri character varying, data jsonb) TO anon;
GRANT ALL ON FUNCTION public.http_get(uri character varying, data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.http_get(uri character varying, data jsonb) TO service_role;


--
-- Name: FUNCTION http_head(uri character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_head(uri character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_head(uri character varying) TO anon;
GRANT ALL ON FUNCTION public.http_head(uri character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_head(uri character varying) TO service_role;


--
-- Name: FUNCTION http_header(field character varying, value character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_header(field character varying, value character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_header(field character varying, value character varying) TO anon;
GRANT ALL ON FUNCTION public.http_header(field character varying, value character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_header(field character varying, value character varying) TO service_role;


--
-- Name: FUNCTION http_list_curlopt(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_list_curlopt() TO postgres;
GRANT ALL ON FUNCTION public.http_list_curlopt() TO anon;
GRANT ALL ON FUNCTION public.http_list_curlopt() TO authenticated;
GRANT ALL ON FUNCTION public.http_list_curlopt() TO service_role;


--
-- Name: FUNCTION http_patch(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying) TO anon;
GRANT ALL ON FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying) TO service_role;


--
-- Name: FUNCTION http_post(uri character varying, data jsonb); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_post(uri character varying, data jsonb) TO postgres;
GRANT ALL ON FUNCTION public.http_post(uri character varying, data jsonb) TO anon;
GRANT ALL ON FUNCTION public.http_post(uri character varying, data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.http_post(uri character varying, data jsonb) TO service_role;


--
-- Name: FUNCTION http_post(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_post(uri character varying, content character varying, content_type character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_post(uri character varying, content character varying, content_type character varying) TO anon;
GRANT ALL ON FUNCTION public.http_post(uri character varying, content character varying, content_type character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_post(uri character varying, content character varying, content_type character varying) TO service_role;


--
-- Name: FUNCTION http_put(uri character varying, content character varying, content_type character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_put(uri character varying, content character varying, content_type character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_put(uri character varying, content character varying, content_type character varying) TO anon;
GRANT ALL ON FUNCTION public.http_put(uri character varying, content character varying, content_type character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_put(uri character varying, content character varying, content_type character varying) TO service_role;


--
-- Name: FUNCTION http_reset_curlopt(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_reset_curlopt() TO postgres;
GRANT ALL ON FUNCTION public.http_reset_curlopt() TO anon;
GRANT ALL ON FUNCTION public.http_reset_curlopt() TO authenticated;
GRANT ALL ON FUNCTION public.http_reset_curlopt() TO service_role;


--
-- Name: FUNCTION http_set_curlopt(curlopt character varying, value character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.http_set_curlopt(curlopt character varying, value character varying) TO postgres;
GRANT ALL ON FUNCTION public.http_set_curlopt(curlopt character varying, value character varying) TO anon;
GRANT ALL ON FUNCTION public.http_set_curlopt(curlopt character varying, value character varying) TO authenticated;
GRANT ALL ON FUNCTION public.http_set_curlopt(curlopt character varying, value character varying) TO service_role;


--
-- Name: FUNCTION is_authenticated(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_authenticated() TO anon;
GRANT ALL ON FUNCTION public.is_authenticated() TO authenticated;
GRANT ALL ON FUNCTION public.is_authenticated() TO service_role;


--
-- Name: FUNCTION search_materiais(p_nome character varying, p_tag numeric, p_quant integer, p_data_entrada text, p_estoque_baixo boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_materiais(p_nome character varying, p_tag numeric, p_quant integer, p_data_entrada text, p_estoque_baixo boolean) TO anon;
GRANT ALL ON FUNCTION public.search_materiais(p_nome character varying, p_tag numeric, p_quant integer, p_data_entrada text, p_estoque_baixo boolean) TO authenticated;
GRANT ALL ON FUNCTION public.search_materiais(p_nome character varying, p_tag numeric, p_quant integer, p_data_entrada text, p_estoque_baixo boolean) TO service_role;


--
-- Name: FUNCTION search_tools(p_nome character varying, p_tipo character varying, p_status character varying, p_quant integer, p_tag character varying, p_caracteristicas text[], p_funcionario text, p_matricula numeric, p_data_emprestado text, p_reserva boolean, p_matricula_reserva text, p_detalhado boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_tools(p_nome character varying, p_tipo character varying, p_status character varying, p_quant integer, p_tag character varying, p_caracteristicas text[], p_funcionario text, p_matricula numeric, p_data_emprestado text, p_reserva boolean, p_matricula_reserva text, p_detalhado boolean) TO anon;
GRANT ALL ON FUNCTION public.search_tools(p_nome character varying, p_tipo character varying, p_status character varying, p_quant integer, p_tag character varying, p_caracteristicas text[], p_funcionario text, p_matricula numeric, p_data_emprestado text, p_reserva boolean, p_matricula_reserva text, p_detalhado boolean) TO authenticated;
GRANT ALL ON FUNCTION public.search_tools(p_nome character varying, p_tipo character varying, p_status character varying, p_quant integer, p_tag character varying, p_caracteristicas text[], p_funcionario text, p_matricula numeric, p_data_emprestado text, p_reserva boolean, p_matricula_reserva text, p_detalhado boolean) TO service_role;


--
-- Name: FUNCTION text_to_bytea(data text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.text_to_bytea(data text) TO postgres;
GRANT ALL ON FUNCTION public.text_to_bytea(data text) TO anon;
GRANT ALL ON FUNCTION public.text_to_bytea(data text) TO authenticated;
GRANT ALL ON FUNCTION public.text_to_bytea(data text) TO service_role;


--
-- Name: FUNCTION unaccent(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent(text) TO postgres;
GRANT ALL ON FUNCTION public.unaccent(text) TO anon;
GRANT ALL ON FUNCTION public.unaccent(text) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent(text) TO service_role;


--
-- Name: FUNCTION unaccent(regdictionary, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO postgres;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO anon;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO service_role;


--
-- Name: FUNCTION unaccent_init(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent_init(internal) TO postgres;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO anon;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO service_role;


--
-- Name: FUNCTION unaccent_lexize(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION urlencode(string bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.urlencode(string bytea) TO postgres;
GRANT ALL ON FUNCTION public.urlencode(string bytea) TO anon;
GRANT ALL ON FUNCTION public.urlencode(string bytea) TO authenticated;
GRANT ALL ON FUNCTION public.urlencode(string bytea) TO service_role;


--
-- Name: FUNCTION urlencode(data jsonb); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.urlencode(data jsonb) TO postgres;
GRANT ALL ON FUNCTION public.urlencode(data jsonb) TO anon;
GRANT ALL ON FUNCTION public.urlencode(data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.urlencode(data jsonb) TO service_role;


--
-- Name: FUNCTION urlencode(string character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.urlencode(string character varying) TO postgres;
GRANT ALL ON FUNCTION public.urlencode(string character varying) TO anon;
GRANT ALL ON FUNCTION public.urlencode(string character varying) TO authenticated;
GRANT ALL ON FUNCTION public.urlencode(string character varying) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE ferramentas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ferramentas TO anon;
GRANT ALL ON TABLE public.ferramentas TO authenticated;
GRANT ALL ON TABLE public.ferramentas TO service_role;


--
-- Name: TABLE funcionarios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.funcionarios TO anon;
GRANT ALL ON TABLE public.funcionarios TO authenticated;
GRANT ALL ON TABLE public.funcionarios TO service_role;


--
-- Name: TABLE materiais; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.materiais TO anon;
GRANT ALL ON TABLE public.materiais TO authenticated;
GRANT ALL ON TABLE public.materiais TO service_role;


--
-- Name: TABLE n8n_chat_avb; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.n8n_chat_avb TO anon;
GRANT ALL ON TABLE public.n8n_chat_avb TO authenticated;
GRANT ALL ON TABLE public.n8n_chat_avb TO service_role;


--
-- Name: SEQUENCE n8n_chat_avb_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.n8n_chat_avb_id_seq TO anon;
GRANT ALL ON SEQUENCE public.n8n_chat_avb_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.n8n_chat_avb_id_seq TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE registro_mate_funcionarios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.registro_mate_funcionarios TO anon;
GRANT ALL ON TABLE public.registro_mate_funcionarios TO authenticated;
GRANT ALL ON TABLE public.registro_mate_funcionarios TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict jDvi3rd81uaennZkCKECX87ay5k7RRctm7FaltCsOmwejcIFSPloxkGlkdFxtbQ

--
-- PostgreSQL database cluster dump complete
--

