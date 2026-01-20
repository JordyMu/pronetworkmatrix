import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <a href="#compensation" className="text-foreground/80 hover:text-primary transition-colors">
              Plan de Compensation
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
              Comment ça Marche
            </a>
            <a href="#join" className="text-foreground/80 hover:text-primary transition-colors">
              Rejoindre
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity">
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
              <a
                href="#compensation"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Plan de Compensation
              </a>
              <a
                href="#how-it-works"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comment ça Marche
              </a>
              <a
                href="#join"
                className="text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Rejoindre
              </a>
              <Button className="bg-gradient-gold text-primary-foreground font-semibold w-full">
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
