import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CompensationPlan from "@/components/CompensationPlan";
import HowItWorks from "@/components/HowItWorks";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CompensationPlan />
      <HowItWorks />
      <JoinCTA />
      <Footer />
    </div>
  );
};

export default Index;
