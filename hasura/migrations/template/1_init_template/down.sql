-- Drop tables in reverse order of creation (due to foreign key constraints)
DROP TABLE IF EXISTS public.chat_message_files CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_threads CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop the trigger function
DROP FUNCTION IF EXISTS public.set_current_timestamp_updated_at() CASCADE;