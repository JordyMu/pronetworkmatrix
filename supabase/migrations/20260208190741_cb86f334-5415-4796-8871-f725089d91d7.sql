-- Fix: Add authorization checks to SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.get_user_network(user_profile_id uuid)
 RETURNS TABLE(profile_id uuid, full_name text, email text, member_position text, generation integer, parent_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  -- Verify caller owns this profile or is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_profile_id 
    AND user_id = auth.uid()
  ) AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to network data';
  END IF;

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

---

CREATE OR REPLACE FUNCTION public.get_network_stats(user_profile_id uuid)
 RETURNS TABLE(generation integer, member_count bigint, reward_per_member integer, total_reward bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  -- Verify caller owns this profile or is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_profile_id 
    AND user_id = auth.uid()
  ) AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to network stats';
  END IF;

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