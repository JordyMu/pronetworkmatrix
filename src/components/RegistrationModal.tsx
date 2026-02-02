import { Crown, X, Key } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrationModal = ({ open, onOpenChange }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    epin: "",
    referralUsername: "",
    position: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [epinValid, setEpinValid] = useState<boolean | null>(null);
  const [epinChecking, setEpinChecking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset e-pin validation when user changes the e-pin
    if (name === "epin") {
      setEpinValid(null);
    }
  };

  const validateEpin = async () => {
    if (!formData.epin || formData.epin.length < 4) {
      toast.error("Veuillez entrer un code e-pin valide");
      return;
    }

    setEpinChecking(true);
    try {
      const { data, error } = await supabase
        .from("e_pins")
        .select("id, is_used, expires_at")
        .eq("code", formData.epin.toUpperCase())
        .maybeSingle();

      if (error) {
        console.error("Error checking e-pin:", error);
        toast.error("Erreur lors de la vérification du code");
        setEpinValid(false);
        return;
      }

      if (!data) {
        toast.error("Code e-pin invalide");
        setEpinValid(false);
        return;
      }

      if (data.is_used) {
        toast.error("Ce code e-pin a déjà été utilisé");
        setEpinValid(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("Ce code e-pin a expiré");
        setEpinValid(false);
        return;
      }

      toast.success("Code e-pin valide!");
      setEpinValid(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur de connexion");
      setEpinValid(false);
    } finally {
      setEpinChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!epinValid) {
      toast.error("Veuillez d'abord valider votre code e-pin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    try {
      // Use e-pin and mark as used
      const { data: validated, error: validateError } = await supabase.rpc(
        "validate_and_use_epin",
        { epin_code: formData.epin }
      );

      if (validateError || !validated) {
        toast.error("Le code e-pin n'est plus valide");
        setEpinValid(false);
        return;
      }

      // Here you would normally handle user registration
      // For now, just show success
      toast.success("Inscription réussie! Votre compte a été créé.");
      console.log("Registration submitted:", formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-primary/30">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 overflow-hidden min-h-[650px]">
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

            {/* Key Icon */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Key className="h-12 w-12 text-primary/50" />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 relative max-h-[90vh] overflow-y-auto">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* E-PIN Field - REQUIRED FIRST */}
              <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                <label className="block text-xs font-semibold text-primary mb-1.5 tracking-wide">
                  CODE E-PIN <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    name="epin"
                    placeholder="Entrer votre code e-pin"
                    value={formData.epin}
                    onChange={handleChange}
                    className={`bg-background/50 border-border/50 focus:border-primary uppercase ${
                      epinValid === true
                        ? "border-green-500 bg-green-500/10"
                        : epinValid === false
                        ? "border-destructive bg-destructive/10"
                        : ""
                    }`}
                    required
                    disabled={epinValid === true}
                  />
                  <Button
                    type="button"
                    onClick={validateEpin}
                    disabled={epinChecking || epinValid === true || !formData.epin}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {epinChecking ? "..." : epinValid ? "✓" : "Valider"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Vous devez avoir un code e-pin valide pour vous inscrire
                </p>
              </div>

              {/* Rest of form - disabled until e-pin is validated */}
              <div className={epinValid !== true ? "opacity-50 pointer-events-none" : ""}>
                {/* Row 1: Referral & Position */}
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                    disabled={isLoading || !epinValid}
                    className="flex-1 bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? "CRÉATION..." : "CRÉER UN COMPTE"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
                    onClick={() => {
                      console.log("Navigate to login");
                    }}
                  >
                    SE CONNECTER
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
