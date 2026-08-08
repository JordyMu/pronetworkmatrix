import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import CompensationPlan from "@/components/CompensationPlan";
import Footer from "@/components/Footer";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import RegistrationModal from "@/components/RegistrationModal";
import { RegistrationProvider, useRegistration } from "@/contexts/RegistrationContext";

const CompensationContent = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isOpen, closeRegistration, openRegistration } = useRegistration();

  const handleSwitchToLogin = () => {
    closeRegistration();
    setLoginOpen(true);
  };

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    openRegistration();
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Plan de Compensation UNITICASH — 7 Générations"
        description="Détail du plan de compensation UNITICASH : matrices 2x2 et 2x3, gains par génération en CDF et bonus associés à chaque niveau."
        path="/compensation"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Plan de Compensation UNITICASH",
          about: "Système de matrice à 7 générations et bonus",
          inLanguage: "fr",
          publisher: { "@type": "Organization", name: "UNITICASH" },
          mainEntityOfPage: "https://uniticash.lovable.app/compensation",
        }}
      />
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <div className="pt-16">
        <CompensationPlan />
      </div>
      <Footer />
      <RegistrationModal open={isOpen} onOpenChange={closeRegistration} onSwitchToLogin={handleSwitchToLogin} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onSwitchToRegister={handleSwitchToRegister} />
    </div>
  );
};

const Compensation = () => (
  <RegistrationProvider>
    <CompensationContent />
  </RegistrationProvider>
);

export default Compensation;
