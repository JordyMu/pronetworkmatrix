import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NetworkMember {
  profile_id: string;
  full_name: string;
  email: string;
  member_position: string | null;
  generation: number;
  parent_id: string | null;
}

interface GenerationStats {
  generation: number;
  member_count: number;
  reward_per_member: number;
  total_reward: number;
}

export const useNetworkStats = (profileId: string | undefined) => {
  const networkQuery = useQuery({
    queryKey: ["network", profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase.rpc("get_user_network", {
        user_profile_id: profileId,
      });

      if (error) {
        console.error("Error fetching network:", error);
        throw error;
      }

      return (data as NetworkMember[]) || [];
    },
    enabled: !!profileId,
  });

  const statsQuery = useQuery({
    queryKey: ["network-stats", profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase.rpc("get_network_stats", {
        user_profile_id: profileId,
      });

      if (error) {
        console.error("Error fetching stats:", error);
        throw error;
      }

      return (data as GenerationStats[]) || [];
    },
    enabled: !!profileId,
  });

  const totalMembers = networkQuery.data?.length || 0;
  const totalRewards = statsQuery.data?.reduce(
    (sum, gen) => sum + (gen.total_reward || 0),
    0
  ) || 0;

  return {
    network: networkQuery.data || [],
    stats: statsQuery.data || [],
    totalMembers,
    totalRewards,
    isLoading: networkQuery.isLoading || statsQuery.isLoading,
    error: networkQuery.error || statsQuery.error,
  };
};
