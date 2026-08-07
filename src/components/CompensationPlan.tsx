import { Award, Gift, TrendingUp, Zap, Users } from "lucide-react";
import MatrixDiagram from "./MatrixDiagram";

interface GenerationCardProps {
  level: number;
  name: string;
  matrixType: "2x2" | "2x3";
  description: string;
  perMember: string;
  calculation: string;
  totalEarnings: string;
  bonuses: string[];
  highlight?: boolean;
}

const GenerationCard = ({
  level,
  name,
  matrixType,
  description,
  perMember,
  calculation,
  totalEarnings,
  bonuses,
  highlight,
}: GenerationCardProps) => {
  const positions = matrixType === "2x2" ? 6 : 14;
  
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

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
          <span className="text-lg font-bold text-primary-foreground">{level}</span>
        </div>
        <div>
          <h3 className="text-sm font-serif font-semibold text-foreground uppercase tracking-wide">
            Génération-{level}-{name}
          </h3>
          <p className="text-xs text-muted-foreground">Matrice {matrixType}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Matrix Diagram */}
        <div className="flex justify-center py-3">
          <MatrixDiagram type={matrixType} label="" compact />
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {description}
        </p>
        
        {/* Positions info */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            Total : <strong className="text-foreground">{positions} personnes</strong>
          </span>
        </div>

        {/* Earnings per member */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Tu gagnes par membre :</div>
          <div className="text-lg font-bold text-primary">{perMember}</div>
        </div>

        {/* Calculation */}
        <div className="text-center py-4 rounded-lg bg-gradient-gold/10 border border-primary/30">
          <div className="text-sm text-muted-foreground mb-1">{calculation}</div>
          <div className="text-2xl font-serif font-bold text-gradient-gold">
            {totalEarnings}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Gains Totaux</div>
        </div>

        {/* Bonuses */}
        {bonuses.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Bonus :
            </div>
            <ul className="space-y-1.5">
              {bonuses.map((bonus, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Gift className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {bonus}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const CompensationPlan = () => {
  const generations = [
    {
      level: 1,
      name: "Semeur",
      matrixType: "2x2" as const,
      description: "Réfère deux (2) personnes. Enseigne ces deux personnes à emmener leurs 2 personnes chacune.",
      perMember: "500.00 CDF",
      calculation: "500.00 CDF × 6",
      totalEarnings: "3,000.00 CDF",
      bonuses: [],
    },
    {
      level: 2,
      name: "Laboureur",
      matrixType: "2x2" as const,
      description: "Tu gagnes sur les 6 membres enregistrés sous ton arbre qui te rejoignent au deuxième niveau.",
      perMember: "1,000.00 CDF",
      calculation: "1,000.00 CDF × 6",
      totalEarnings: "6,000.00 CDF",
      bonuses: [],
    },
    {
      level: 3,
      name: "Récolteur",
      matrixType: "2x2" as const,
      description: "Tu gagnes sur les premiers 6 membres enregistrés sous ton arbre qui te rejoignent au troisième niveau.",
      perMember: "3,000.00 CDF",
      calculation: "3,000.00 CDF × 6",
      totalEarnings: "18,000.00 CDF",
      bonuses: ["Sac de farine", "Lampe rechargeable"],
      highlight: true,
    },
    {
      level: 4,
      name: "Marchand",
      matrixType: "2x2" as const,
      description: "Tu gagnes sur les premiers 6 membres enregistrés sous ton arbre qui te rejoignent au quatrième niveau.",
      perMember: "10,000.00 CDF",
      calculation: "10,000.00 CDF × 6",
      totalEarnings: "60,000.00 CDF",
      bonuses: ["Décodeur", "Jeu de casseroles"],
    },
    {
      level: 5,
      name: "Commerçant",
      matrixType: "2x3" as const,
      description: "Tu gagnes sur les premiers 14 membres enregistrés sous ton arbre de génération qui te rejoignent au cinquième niveau.",
      perMember: "20,000.00 CDF",
      calculation: "20,000.00 CDF × 14",
      totalEarnings: "280,000.00 CDF",
      bonuses: ["Téléphone Androïde", "Voucher d'études scolaire (150,000 CDF)"],
    },
    {
      level: 6,
      name: "Directeur",
      matrixType: "2x3" as const,
      description: "Tu gagnes sur les premiers 14 membres enregistrés sous ton arbre de généalogie qui montent à la sixième génération.",
      perMember: "40,000.00 CDF",
      calculation: "40,000.00 CDF × 14",
      totalEarnings: "560,000.00 CDF",
      bonuses: ["Kit solaire"],
    },
    {
      level: 7,
      name: "Businessman",
      matrixType: "2x3" as const,
      description: "Tu gagnes sur les premiers 14 membres enregistrés sous ton arbre de généalogie qui montent à la septième génération.",
      perMember: "80,000.00 CDF",
      calculation: "80,000.00 CDF × 14",
      totalEarnings: "1,120,000.00 CDF",
      bonuses: ["Congélateur", "Voucher frais de minerval (250,000 CDF)"],
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
            Notre système de matrice unique vous récompense à chaque génération. Commencez à
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

        {/* Generation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generations.map((gen) => (
            <GenerationCard key={gen.level} {...gen} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-card border border-primary/30">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-foreground">
              <strong className="text-gradient-gold">Frais d'Adhésion :</strong> Seulement 5,000 CDF pour commencer !
            </span>
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompensationPlan;
