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

interface LevelCardProps {
  level: number;
  name: string;
  matrixType: "2x2" | "2x3";
  multiplier: string;
  earnings: string;
  rewards: string[];
  highlight?: boolean;
}

const LevelCard = ({
  level,
  name,
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
          Populaire
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
          <span className="text-lg font-bold text-primary-foreground">{level}</span>
        </div>
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground">
            Génération {level}
          </h3>
          <p className="text-xs text-primary font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">Matrice {matrixType}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <span className="text-sm text-muted-foreground">Multiplicateur</span>
          <span className="font-semibold text-primary">{multiplier}</span>
        </div>

        <div className="text-center py-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-2xl font-serif font-bold text-gradient-gold">
            {earnings}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Gains Totaux</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Récompenses Incluses :
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
      name: "Semeur",
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "150€",
      rewards: ["30€ EPINS", "50€ Produits"],
    },
    {
      level: 2,
      name: "Laboureur",
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "300€",
      rewards: ["60€ EPINS", "100€ Produits"],
    },
    {
      level: 3,
      name: "Récolteur",
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "700€",
      rewards: ["500€ Bon d'Achat/Crédit Téléphone", "150€ EPINS", "250€ Produits"],
      highlight: true,
    },
    {
      level: 4,
      name: "Marchand",
      matrixType: "2x2" as const,
      multiplier: "$$ × 6",
      earnings: "7 000€",
      rewards: ["4 000€ Bon Alimentaire/Ordinateur", "300€ EPINS", "500€ Produits"],
    },
    {
      level: 5,
      name: "Commerçant",
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "70 000€",
      rewards: ["10 000€ Voyages Locaux", "30 000€ Mobilier", "300€ EPINS", "700€ Produits"],
    },
    {
      level: 6,
      name: "Entrepreneur",
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "140 000€",
      rewards: ["200 000€ Fonds Voiture", "300 000€ Fonds Maison", "1 200€ EPINS", "2 800€ Produits"],
    },
    {
      level: 7,
      name: "Magnat",
      matrixType: "2x3" as const,
      multiplier: "$$ × 14",
      earnings: "500 000€+",
      rewards: ["Bonus Exécutifs", "Récompenses Leadership", "Revenus Résiduels", "Héritage Durable"],
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
            <span className="text-sm text-primary font-medium">Système à 7 Générations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Plan de <span className="text-gradient-gold">Compensation</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Notre système de matrice unique vous récompense à chaque niveau. Commencez à
            construire votre réseau et regardez vos gains croître de façon exponentielle.
          </p>
        </div>

        {/* Matrix Diagrams */}
        <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
          <div className="p-8 rounded-2xl bg-gradient-card border border-border">
            <MatrixDiagram type="2x2" label="Générations 1-4 : Matrice 2×2" />
          </div>
          <div className="p-8 rounded-2xl bg-gradient-card border border-border">
            <MatrixDiagram type="2x3" label="Générations 5-7 : Matrice 2×3" />
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
              <strong className="text-gradient-gold">Frais d'Adhésion :</strong> Seulement 30€ pour commencer !
            </span>
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompensationPlan;
