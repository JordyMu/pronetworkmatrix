-- Create profiles table for the MLM network
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "position" TEXT CHECK ("position" IN ('gauche', 'droite')),
  referred_by UUID REFERENCES public.profiles(id),
  epin_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Recursive function to get user network (up to 7 generations)
CREATE OR REPLACE FUNCTION public.get_user_network(user_profile_id UUID)
RETURNS TABLE(
  profile_id UUID,
  full_name TEXT,
  email TEXT,
  member_position TEXT,
  generation INT,
  parent_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE network AS (
    SELECT 
      p.id AS profile_id,
      p.full_name,
      p.email,
      p."position" AS member_position,
      1 AS generation,
      p.referred_by AS parent_id
    FROM public.profiles p
    WHERE p.referred_by = user_profile_id
    
    UNION ALL
    
    SELECT 
      p.id AS profile_id,
      p.full_name,
      p.email,
      p."position" AS member_position,
      n.generation + 1 AS generation,
      p.referred_by AS parent_id
    FROM public.profiles p
    INNER JOIN network n ON p.referred_by = n.profile_id
    WHERE n.generation < 7
  )
  SELECT * FROM network ORDER BY generation, full_name;
END;
$$;

-- Function to get network stats with rewards per generation
CREATE OR REPLACE FUNCTION public.get_network_stats(user_profile_id UUID)
RETURNS TABLE(
  generation INT,
  member_count BIGINT,
  reward_per_member INT,
  total_reward BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH network_data AS (
    SELECT * FROM public.get_user_network(user_profile_id)
  ),
  rewards AS (
    SELECT 
      nd.generation,
      COUNT(*) AS member_count,
      CASE nd.generation
        WHEN 1 THEN 500
        WHEN 2 THEN 1000
        WHEN 3 THEN 3000
        WHEN 4 THEN 10000
        WHEN 5 THEN 20000
        WHEN 6 THEN 40000
        WHEN 7 THEN 80000
        ELSE 0
      END AS reward_per_member
    FROM network_data nd
    GROUP BY nd.generation
  )
  SELECT 
    r.generation,
    r.member_count,
    r.reward_per_member,
    r.member_count * r.reward_per_member AS total_reward
  FROM rewards r
  ORDER BY r.generation;
END;
$$;