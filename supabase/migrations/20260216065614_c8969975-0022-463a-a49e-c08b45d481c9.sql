
-- Table for pre-registration / join requests
CREATE TABLE public.join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  referral_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can INSERT a join request
CREATE POLICY "Anyone can submit a join request"
ON public.join_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view/manage join requests
CREATE POLICY "Admins can view join requests"
ON public.join_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update join requests"
ON public.join_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete join requests"
ON public.join_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE TRIGGER update_join_requests_updated_at
BEFORE UPDATE ON public.join_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
