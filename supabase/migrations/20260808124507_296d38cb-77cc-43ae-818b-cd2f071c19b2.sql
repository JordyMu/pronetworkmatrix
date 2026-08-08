-- 1. Remove anon (signed-out) execute rights on SECURITY DEFINER functions.
REVOKE ALL ON FUNCTION public.check_epin_validity(character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_and_use_epin(character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_profile_on_signup(uuid, text, text, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_epin_validity(character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_and_use_epin(character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_profile_on_signup(uuid, text, text, text, uuid, text) TO service_role;

-- has_role / network functions stay internal or authenticated-only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_user_network(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_network_stats(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.generate_epins(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_epins(integer) TO service_role;

-- 2. Anon must not see any table in the API/GraphQL schema except inserting a join request.
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.user_roles FROM anon;
REVOKE ALL ON TABLE public.e_pins FROM anon;
REVOKE ALL ON TABLE public.join_requests FROM anon;
GRANT INSERT ON TABLE public.join_requests TO anon;

-- 3. Trim unnecessary privileges for signed-in users.
REVOKE ALL ON TABLE public.profiles FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

REVOKE ALL ON TABLE public.user_roles FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;

REVOKE ALL ON TABLE public.e_pins FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.e_pins TO authenticated;

REVOKE ALL ON TABLE public.join_requests FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.join_requests TO authenticated;

GRANT ALL ON TABLE public.profiles, public.user_roles, public.e_pins, public.join_requests TO service_role;

-- 4. Anon insert policy for join requests must stay usable by both roles.
DROP POLICY IF EXISTS "Anyone can submit a join request" ON public.join_requests;
CREATE POLICY "Anyone can submit a join request"
ON public.join_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);