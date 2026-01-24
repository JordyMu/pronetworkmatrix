import { Crown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrationModal = ({ open, onOpenChange }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    referralUsername: "",
    position: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    console.log("Registration submitted:", formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-primary/30">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 overflow-hidden min-h-[600px]">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-green-500/20 to-blue-600/30" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <p className="text-sm tracking-[0.3em] text-foreground/70 mb-2">
                BIENVENUE SUR
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
                PRONETWORK
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4" />
              <p className="text-lg text-primary font-medium">
                Créez Votre Compte
              </p>
            </div>

            {/* Crown Icon */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Crown className="h-12 w-12 text-primary/50" />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mobile Header */}
            <div className="md:hidden text-center mb-6">
              <Crown className="h-10 w-10 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-serif font-bold text-gradient-gold">
                PRONETWORK
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Referral & Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    NOM D'UTILISATEUR PARRAIN <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="referralUsername"
                    placeholder="Entrer le nom du parrain"
                    value={formData.referralUsername}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    POSITION <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="gauche">Gauche</option>
                    <option value="droite">Droite</option>
                  </select>
                </div>
              </div>

              {/* Row 2: First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    PRÉNOM <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="firstName"
                    placeholder="Entrer votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    NOM <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Entrer votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Username */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                  NOM D'UTILISATEUR <span className="text-destructive">*</span>
                </label>
                <Input
                  name="username"
                  placeholder="Choisir un nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              {/* Row 4: Email */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                  EMAIL <span className="text-destructive">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Entrer votre email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              {/* Row 5: Password & Confirm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    MOT DE PASSE <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    CONFIRMER <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity"
                >
                  CRÉER UN COMPTE
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
                  onClick={() => {
                    // Handle login navigation
                    console.log("Navigate to login");
                  }}
                >
                  SE CONNECTER
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
