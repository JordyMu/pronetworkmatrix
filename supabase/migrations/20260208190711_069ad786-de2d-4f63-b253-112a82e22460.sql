-- Fix: Restrict profiles SELECT policy to only own data
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix: Restrict e_pins SELECT policy - only allow checking via the validation function
DROP POLICY IF EXISTS "Anyone can validate e-pins" ON public.e_pins;

-- No direct SELECT access needed - validation is done via SECURITY DEFINER function validate_and_use_epin