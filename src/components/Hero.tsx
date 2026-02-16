import { ArrowRight, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useRegistration } from "@/contexts/RegistrationContext";

const Hero = () => {
  const { openRegistration } = useRegistration();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gold" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Construisez Votre Avenir Financier
            </span>
          </div>

          {/* Crown Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Crown className="h-20 w-20 text-primary animate-float" />
              <div className="absolute inset-0 h-20 w-20 bg-primary/30 blur-2xl" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Bienvenue sur{" "}
            <span className="text-gradient-gold">ProNetwork</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Rejoignez notre système de matrice révolutionnaire et débloquez un
            potentiel de gains illimité. Commencez votre chemin vers la liberté financière dès aujourd'hui.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              onClick={openRegistration}
              className="bg-gradient-gold text-primary-foreground font-semibold text-lg px-8 py-6 shadow-gold hover:opacity-90 transition-all hover:scale-105"
            >
              Rejoindre Maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/compensation">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                Voir le Plan de Compensation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold">
                7
              </div>
              <div className="text-sm text-foreground/60 mt-1">Niveaux</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold">
                2x2 | 2x3
              </div>
              <div className="text-sm text-foreground/60 mt-1">Système de Matrice</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold">
                ∞
              </div>
              <div className="text-sm text-foreground/60 mt-1">Potentiel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
