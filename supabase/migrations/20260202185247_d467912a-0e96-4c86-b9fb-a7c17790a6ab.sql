-- Create a function to create profile during signup (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_profile_on_signup(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_position TEXT DEFAULT NULL,
  p_referred_by UUID DEFAULT NULL,
  p_epin_used TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_profile_id UUID;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, "position", referred_by, epin_used)
  VALUES (p_user_id, p_full_name, p_email, p_position, p_referred_by, p_epin_used)
  RETURNING id INTO new_profile_id;
  
  RETURN new_profile_id;
END;
$$;