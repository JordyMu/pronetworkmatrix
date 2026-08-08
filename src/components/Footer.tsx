import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-serif font-bold text-gradient-gold">
              UNITICASH
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="/#home" className="hover:text-primary transition-colors">
              Accueil
            </a>
            <Link to="/compensation" className="hover:text-primary transition-colors">
              Plan de Compensation
            </Link>
            <a href="/#how-it-works" className="hover:text-primary transition-colors">
              Comment ça Marche
            </a>
            <a href="/#join" className="hover:text-primary transition-colors">
              Rejoindre
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UNITICASH. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
