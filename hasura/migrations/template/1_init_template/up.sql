-- Create updated_at trigger function
SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;

-- Users table (core table for authentication)
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    email text NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    avatar_url text,
    stripe_customer_id text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_stripe_customer_id_key UNIQUE (stripe_customer_id)
);

-- Chat threads table (if using chat feature)
CREATE TABLE public.chat_threads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    title text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT chat_threads_pkey PRIMARY KEY (id),
    CONSTRAINT chat_threads_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Chat messages table (if using chat feature)
CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    chat_thread_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
    CONSTRAINT chat_messages_chat_thread_id_fkey FOREIGN KEY (chat_thread_id) 
        REFERENCES public.chat_threads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chat_messages_role_check CHECK (role IN ('user', 'assistant', 'system'))
);

-- Chat message files table (if using file uploads with chat)
CREATE TABLE public.chat_message_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    chat_message_id uuid NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_url text NOT NULL,
    mime_type text NOT NULL,
    size integer NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT chat_message_files_pkey PRIMARY KEY (id),
    CONSTRAINT chat_message_files_chat_message_id_fkey FOREIGN KEY (chat_message_id) 
        REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX chat_threads_user_id_idx ON public.chat_threads(user_id);
CREATE INDEX chat_messages_chat_thread_id_idx ON public.chat_messages(chat_thread_id);
CREATE INDEX chat_message_files_chat_message_id_idx ON public.chat_message_files(chat_message_id);

-- Add updated_at triggers
CREATE TRIGGER set_public_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_public_chat_threads_updated_at 
    BEFORE UPDATE ON public.chat_threads 
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_public_chat_messages_updated_at 
    BEFORE UPDATE ON public.chat_messages 
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_public_chat_message_files_updated_at 
    BEFORE UPDATE ON public.chat_message_files 
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Example: Add your own tables below
-- CREATE TABLE public.your_table (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     created_at timestamp with time zone DEFAULT now() NOT NULL,
--     updated_at timestamp with time zone DEFAULT now() NOT NULL,
--     deleted_at timestamp with time zone,
--     user_id uuid NOT NULL,
--     -- Add your columns here
--     CONSTRAINT your_table_pkey PRIMARY KEY (id),
--     CONSTRAINT your_table_user_id_fkey FOREIGN KEY (user_id) 
--         REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE
-- );
-- 
-- CREATE TRIGGER set_public_your_table_updated_at 
--     BEFORE UPDATE ON public.your_table 
--     FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();