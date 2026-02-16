import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import HowItWorks from "@/components/HowItWorks";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import LoginModal from "@/components/LoginModal";
import {
  RegistrationProvider,
  useRegistration,
} from "@/contexts/RegistrationContext";
import { useAuth } from "@/hooks/useAuth";

const IndexContent = () => {
  const navigate = useNavigate();
  const { isOpen, closeRegistration, openRegistration } = useRegistration();
  const { isAuthenticated, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

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
      <Hero />
      
      <HowItWorks />
      <JoinCTA />
      <Footer />
      <RegistrationModal 
        open={isOpen} 
        onOpenChange={closeRegistration}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  );
};

const Index = () => {
  return (
    <RegistrationProvider>
      <IndexContent />
    </RegistrationProvider>
  );
};

export default Index;
