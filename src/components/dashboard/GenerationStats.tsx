import { TrendingUp, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenerationStat {
  generation: number;
  member_count: number;
  reward_per_member: number;
  total_reward: number;
}

interface GenerationStatsProps {
  stats: GenerationStat[];
  totalRewards: number;
  isLoading: boolean;
}

const GenerationStats = ({ stats, totalRewards, isLoading }: GenerationStatsProps) => {
  const formatCDF = (amount: number) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount) + " CDF";
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient-gold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Statistiques par Génération
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const allGenerations = [1, 2, 3, 4, 5, 6, 7];
  const rewardsPerGen: Record<number, number> = {
    1: 500,
    2: 1000,
    3: 3000,
    4: 10000,
    5: 20000,
    6: 40000,
    7: 80000,
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-gold">
          <TrendingUp className="h-5 w-5 text-primary" />
          Statistiques par Génération
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Total Earnings Card */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <div className="flex items-center gap-3">
            <Coins className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total des Gains</p>
              <p className="text-2xl font-bold text-gradient-gold">
                {formatCDF(totalRewards)}
              </p>
            </div>
          </div>
        </div>

        {/* Generation Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">
                  GÉNÉRATION
                </th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">
                  MEMBRES
                </th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                  GAIN/MEMBRE
                </th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {allGenerations.map((gen) => {
                const stat = stats.find((s) => s.generation === gen);
                const memberCount = stat?.member_count || 0;
                const totalReward = stat?.total_reward || 0;

                return (
                  <tr
                    key={gen}
                    className="border-b border-border/30 hover:bg-background/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="font-medium">Génération {gen}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          memberCount > 0
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {memberCount}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-muted-foreground">
                      {formatCDF(rewardsPerGen[gen])}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-semibold ${
                          totalReward > 0 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {formatCDF(totalReward)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationStats;
