-- Allow anyone to check e-pin validity (read-only, limited columns)
CREATE POLICY "Anyone can check e-pin validity"
ON public.e_pins
FOR SELECT
USING (true);