import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CompensationPlan from "@/components/CompensationPlan";
import HowItWorks from "@/components/HowItWorks";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import {
  RegistrationProvider,
  useRegistration,
} from "@/contexts/RegistrationContext";

const IndexContent = () => {
  const { isOpen, closeRegistration } = useRegistration();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CompensationPlan />
      <HowItWorks />
      <JoinCTA />
      <Footer />
      <RegistrationModal open={isOpen} onOpenChange={closeRegistration} />
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
