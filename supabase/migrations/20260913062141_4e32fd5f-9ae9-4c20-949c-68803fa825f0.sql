
UPDATE public.profiles
SET referred_by = '7086c99e-1f1e-4f09-8379-77d3915f5e36'
WHERE id IN (
  'bb8c6ea0-1e6d-4b94-91c8-7733c72ce988',
  '5e60d454-5fb3-4d22-9a8d-858a61b0b459',
  'b927cc17-281a-4741-a2d3-1f1c87eccfe7',
  '0ad9af0c-95bf-4234-8099-1164af01e3fa'
);

CREATE OR REPLACE FUNCTION public.get_network_stats(user_profile_id uuid)
 RETURNS TABLE(generation integer, member_count bigint, reward_per_member integer, total_reward bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
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
        WHEN 1 THEN 250
        WHEN 2 THEN 500
        WHEN 3 THEN 1000
        WHEN 4 THEN 1750
        WHEN 5 THEN 5000
        WHEN 6 THEN 10000
        WHEN 7 THEN 20000
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
$function$;
