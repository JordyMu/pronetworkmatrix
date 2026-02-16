import { Crown, Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRegistration } from "@/contexts/RegistrationContext";

interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openRegistration } = useRegistration();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-gradient-gold">
              ProNetwork
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground/80 hover:text-primary transition-colors">
              Accueil
            </a>
            <Link to="/compensation" className="text-foreground/80 hover:text-primary transition-colors">
              Plan de Compensation
            </Link>
            <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
              Comment ça Marche
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={onLoginClick}
              className="border-primary/50 hover:bg-primary/10"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Button>
            <Button 
              onClick={openRegistration}
              className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity"
            >
              Commencer
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#home"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </a>
              <Link
                to="/compensation"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Plan de Compensation
              </Link>
              <a
                href="#how-it-works"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comment ça Marche
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openRegistration();
                }}
                className="text-foreground/80 hover:text-primary transition-colors text-left"
              >
                Rejoindre
              </button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick?.();
                }}
                className="border-primary/50 w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  openRegistration();
                }}
                className="bg-gradient-gold text-primary-foreground font-semibold w-full"
              >
                Commencer
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
