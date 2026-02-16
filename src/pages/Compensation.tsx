import Navbar from "@/components/Navbar";
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
