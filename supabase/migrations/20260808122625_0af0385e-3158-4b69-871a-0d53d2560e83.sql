-- 1. Remove public read access to e_pins (codes were harvestable)
DROP POLICY IF EXISTS "Anyone can check e-pin validity" ON public.e_pins;
REVOKE ALL ON public.e_pins FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.e_pins TO authenticated;
GRANT ALL ON public.e_pins TO service_role;

-- Explicit admin-only INSERT policy
DROP POLICY IF EXISTS "Admins can create e-pins" ON public.e_pins;
CREATE POLICY "Admins can create e-pins"
  ON public.e_pins
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Safe validity check that never exposes codes in bulk
CREATE OR REPLACE FUNCTION public.check_epin_validity(epin_code character varying)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.e_pins
    WHERE code = UPPER(epin_code)
      AND is_used = false
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- 3. Admin-only e-pin generation
CREATE OR REPLACE FUNCTION public.generate_epins(count integer DEFAULT 1)
RETURNS TABLE(code character varying)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_code VARCHAR(12);
  i INTEGER;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can generate e-pins';
  END IF;

  FOR i IN 1..count LOOP
    new_code := generate_epin_code();
    INSERT INTO public.e_pins (code) VALUES (new_code);
    code := new_code;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- 4. Lock down function execution
REVOKE ALL ON FUNCTION public.generate_epins(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_epins(integer) TO service_role;

REVOKE ALL ON FUNCTION public.generate_epin_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_epin_code() TO service_role;

REVOKE ALL ON FUNCTION public.get_user_network(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_network(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_network_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_network_stats(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Signup-time functions must stay callable by anon
REVOKE ALL ON FUNCTION public.validate_and_use_epin(character varying) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_and_use_epin(character varying) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_profile_on_signup(uuid, text, text, text, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_profile_on_signup(uuid, text, text, text, uuid, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.check_epin_validity(character varying) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_epin_validity(character varying) TO anon, authenticated, service_role;