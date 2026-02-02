-- Create e_pins table for storing registration codes
CREATE TABLE public.e_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(12) NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.e_pins ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can check if an e-pin is valid (for registration)
CREATE POLICY "Anyone can validate e-pins"
ON public.e_pins
FOR SELECT
USING (true);

-- Policy: Allow updating e-pin status during registration (mark as used)
CREATE POLICY "Allow marking e-pins as used"
ON public.e_pins
FOR UPDATE
USING (is_used = false)
WITH CHECK (is_used = true);

-- Create function to generate random e-pin code
CREATE OR REPLACE FUNCTION public.generate_epin_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to generate multiple e-pins (for admin use)
CREATE OR REPLACE FUNCTION public.generate_epins(count INTEGER DEFAULT 1)
RETURNS TABLE(code VARCHAR(12)) AS $$
DECLARE
  new_code VARCHAR(12);
  i INTEGER;
BEGIN
  FOR i IN 1..count LOOP
    new_code := generate_epin_code();
    INSERT INTO public.e_pins (code) VALUES (new_code);
    code := new_code;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to validate and use e-pin
CREATE OR REPLACE FUNCTION public.validate_and_use_epin(epin_code VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  pin_record RECORD;
BEGIN
  SELECT * INTO pin_record FROM public.e_pins 
  WHERE code = UPPER(epin_code) 
  AND is_used = false 
  AND (expires_at IS NULL OR expires_at > now());
  
  IF pin_record IS NULL THEN
    RETURN false;
  END IF;
  
  UPDATE public.e_pins 
  SET is_used = true, used_at = now()
  WHERE id = pin_record.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;