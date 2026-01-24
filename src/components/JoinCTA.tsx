import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useRegistration } from "@/contexts/RegistrationContext";

const JoinCTA = () => {
  const { openRegistration } = useRegistration();

  return (
    <section id="join" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Commencez Votre Parcours Aujourd'hui
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Prêt à{" "}
            <span className="text-gradient-gold">Transformer</span>
            <br />
            Votre Vie ?
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de membres qui construisent déjà leur avenir
            financier avec ProNetwork. Votre histoire de succès commence ici.
          </p>

          {/* Joining Fee Highlight */}
          <div className="inline-block p-6 rounded-2xl bg-gradient-card border border-primary/30 mb-10 shadow-gold animate-pulse-gold">
            <div className="text-sm text-muted-foreground mb-1">
              Frais d'Adhésion
            </div>
            <div className="text-5xl font-serif font-bold text-gradient-gold">
              5,000 CDF
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Paiement unique • Accès à vie
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={openRegistration}
              className="bg-gradient-gold text-primary-foreground font-semibold text-lg px-10 py-7 shadow-gold hover:opacity-90 transition-all hover:scale-105"
            >
              Rejoindre ProNetwork
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>Appelez-nous pour plus d'infos</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Support WhatsApp disponible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCTA;
