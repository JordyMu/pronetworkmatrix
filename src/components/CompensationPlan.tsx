import { Award, Gift, TrendingUp, Zap } from "lucide-react";
import MatrixDiagram from "./MatrixDiagram";

interface LevelCardProps {
  level: number;
  matrixType: "2x2" | "2x3";
  multiplier: string;
  earnings: string;
  rewards: string[];
  highlight?: boolean;
}

const LevelCard = ({
  level,
  matrixType,
  multiplier,
  earnings,
  rewards,
  highlight,
}: LevelCardProps) => {
  return (
    <div
      className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
        highlight
          ? "bg-gradient-card border-primary shadow-gold"
          : "bg-card border-border shadow-card hover:border-primary/50"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-gold rounded-full text-xs font-semibold text-primary-foreground">
          Popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
          <span className="text-lg font-bold text-primary-foreground">{level}</span>
        </div>
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground">
            Level {level}
          </h3>
          <p className="text-sm text-muted-foreground">{matrixType} Matrix</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <span className="text-sm text-muted-foreground">Multiplier</span>
          <span className="font-semibold text-primary">{multiplier}</span>
        </div>

        <div className="text-center py-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-2xl font-serif font-bold text-gradient-gold">
            {earnings}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Earnings</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Rewards Include:
          </div>
          <ul className="space-y-1.5">
            {rewards.map((reward, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                <Gift className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {reward}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const CompensationPlan = () => {
  const levels = [
    {
      level: 1,
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "R150",
      rewards: ["R30 EPINS", "R50 Products"],
    },
    {
      level: 2,
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "R300",
      rewards: ["R60 EPINS", "R100 Products"],
    },
    {
      level: 3,
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "R700",
      rewards: ["R500 Gift Voucher/Airtime", "R150 EPINS", "R250 Products"],
      highlight: true,
    },
    {
      level: 4,
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "R7,000",
      rewards: ["R4,000 Grocery Voucher/Laptop", "R300 EPINS", "R500 Products"],
    },
    {
      level: 5,
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "R70,000",
      rewards: ["R10,000 Local Trips", "R30,000 Furniture", "R300 EPINS", "R700 Products"],
    },
    {
      level: 6,
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "R140,000",
      rewards: ["R200,000 Car Fund", "R300,000 House Fund", "R1,200 EPINS", "R2,800 Products"],
    },
    {
      level: 7,
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "R500,000+",
      rewards: ["Executive Bonuses", "Leadership Rewards", "Residual Income", "Legacy Building"],
    },
  ];

  return (
    <section id="compensation" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">7-Level System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="text-gradient-gold">Compensation</span> Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Our unique matrix system rewards you at every level. Start building
            your network and watch your earnings grow exponentially.
          </p>
        </div>

        {/* Matrix Diagrams */}
        <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
          <div className="p-8 rounded-2xl bg-gradient-card border border-border">
            <MatrixDiagram type="2x2" label="Levels 1-4: 2×2 Matrix" />
          </div>
          <div className="p-8 rounded-2xl bg-gradient-card border border-border">
            <MatrixDiagram type="2x3" label="Levels 5-7: 2×3 Matrix" />
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {levels.map((level) => (
            <LevelCard key={level.level} {...level} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-card border border-primary/30">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-foreground">
              <strong className="text-gradient-gold">Joining Fee:</strong> Only R30 to start!
            </span>
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompensationPlan;
