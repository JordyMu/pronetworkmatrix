import { CheckCircle, Rocket, Users, Wallet } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Join the Network",
    description:
      "Pay the minimal joining fee and become part of the ProNetwork family. Get instant access to your dashboard.",
  },
  {
    icon: Users,
    title: "Build Your Team",
    description:
      "Invite others to join under you. Fill your matrix positions and help your team members do the same.",
  },
  {
    icon: Rocket,
    title: "Level Up",
    description:
      "Complete each level's matrix to unlock the next. Progress through all 7 levels for maximum earnings.",
  },
  {
    icon: CheckCircle,
    title: "Earn Rewards",
    description:
      "Receive cash bonuses, products, vouchers, and exclusive rewards at every level you complete.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            How <span className="text-gradient-gold">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started with ProNetwork is simple. Follow these four steps
            to begin your journey to financial success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}

              <div className="relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 group-hover:shadow-gold">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
