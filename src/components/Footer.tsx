import { Crown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-serif font-bold text-gradient-gold">
              ProNetwork
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-primary transition-colors">
              Home
            </a>
            <a href="#compensation" className="hover:text-primary transition-colors">
              Compensation Plan
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#join" className="hover:text-primary transition-colors">
              Join Now
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProNetwork. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
