import { Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationStat {
  generation: number;
  member_count: number;
  reward_per_member: number;
  total_reward: number;
}

interface GenerationProgressProps {
  stats: GenerationStat[];
  isLoading: boolean;
}

const REQUIRED_PER_GENERATION = 6;
const MAX_GENERATION = 7;

const GENERATION_TITLES: Record<number, string> = {
  1: "Débutant",
  2: "Bronze",
  3: "Argent",
  4: "Or",
  5: "Platine",
  6: "Directeur",
  7: "Ambassadeur",
};

export const getCurrentGeneration = (stats: GenerationStat[]) => {
  let current = 1;
  for (let gen = 1; gen <= MAX_GENERATION; gen++) {
    const count = stats.find((s) => s.generation === gen)?.member_count || 0;
    if (count >= REQUIRED_PER_GENERATION && gen < MAX_GENERATION) {
      current = gen + 1;
    } else {
      current = gen;
      break;
    }
  }
  return current;
};

const GenerationProgress = ({ stats, isLoading }: GenerationProgressProps) => {
  const currentGeneration = getCurrentGeneration(stats);
  const currentCount =
    stats.find((s) => s.generation === currentGeneration)?.member_count || 0;
  const remaining = Math.max(REQUIRED_PER_GENERATION - currentCount, 0);
  const percent = Math.min((currentCount / REQUIRED_PER_GENERATION) * 100, 100);
  const isMax = currentGeneration >= MAX_GENERATION && remaining === 0;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-gold">
          <Rocket className="h-5 w-5 text-primary" />
          Ma Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Génération actuelle</p>
                <p className="text-2xl font-bold text-gradient-gold">
                  Génération {currentGeneration}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    — {GENERATION_TITLES[currentGeneration]}
                  </span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentCount}/{REQUIRED_PER_GENERATION} membres
              </p>
            </div>

            <Progress value={percent} className="h-3" />

            <p className="text-sm text-muted-foreground">
              {isMax
                ? "Félicitations ! Vous avez atteint la dernière génération."
                : remaining > 0
                ? `Encore ${remaining} membre${remaining > 1 ? "s" : ""} pour passer à la Génération ${Math.min(
                    currentGeneration + 1,
                    MAX_GENERATION
                  )}.`
                : `Objectif atteint ! Vous passez à la Génération ${Math.min(
                    currentGeneration + 1,
                    MAX_GENERATION
                  )}.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerationProgress;
