-- Remove the foreign key constraint that causes issues with unconfirmed users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Add a unique constraint on user_id instead (without foreign key reference)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);