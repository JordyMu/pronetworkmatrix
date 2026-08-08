import { Crown, X, Key } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logError } from "@/lib/logger";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
}

const RegistrationModal = ({ open, onOpenChange, onSwitchToLogin }: RegistrationModalProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("ref");

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
  const [referrerProfile, setReferrerProfile] = useState<{ id: string; full_name: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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
      const { data, error } = await supabase.functions.invoke("epin-check", {
        body: { code: formData.epin.toUpperCase() },
      });

      if (error) {
        logError("Error checking e-pin", error);
        toast.error("Erreur lors de la vérification du code");
        setEpinValid(false);
        return;
      }

      if (!data?.valid) {
        toast.error("Code e-pin invalide, déjà utilisé ou expiré");
        setEpinValid(false);
        return;
      }


      toast.success("Code e-pin valide!");
      setEpinValid(true);
    } catch (error) {
      logError("Error checking e-pin", error);
      toast.error("Erreur de connexion");
      setEpinValid(false);
    } finally {
      setEpinChecking(false);
    }
  };

  // Escape LIKE/ILIKE wildcards so users can't broaden the search with % or _
  const escapeLikePattern = (input: string) => input.replace(/[\\%_]/g, "\\$&");

  const findReferrer = async () => {
    const term = formData.referralUsername.trim();
    if (term.length < 2) {
      toast.error("Entrez au moins 2 caractères pour rechercher un parrain");
      return;
    }
    if (term.length > 100) {
      toast.error("Nom de parrain trop long");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .ilike("full_name", `%${escapeLikePattern(term)}%`)
      .limit(1)
      .maybeSingle();

    if (data) {
      setReferrerProfile(data);
      toast.success(`Parrain trouvé: ${data.full_name}`);
    } else {
      setReferrerProfile(null);
      toast.error("Parrain non trouvé");
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

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });

      if (authError) {
        logError("Auth error", authError);
        toast.error(
          authError.message?.toLowerCase().includes("already registered")
            ? "Un compte existe déjà avec cet email"
            : "Impossible de créer le compte. Vérifiez vos informations."
        );
        return;
      }

      if (!authData.user) {
        toast.error("Erreur lors de la création du compte");
        return;
      }

      // Determine the referrer
      const referredById = referrerProfile?.id || referralId || null;

      // Consume the e-pin and create the profile server-side (service role)
      const { data: regData, error: regError } = await supabase.functions.invoke(
        "register-member",
        {
          body: {
            userId: authData.user.id,
            email: formData.email,
            fullName: `${formData.firstName} ${formData.lastName}`,
            position: formData.position || null,
            referredBy: referredById,
            epin: formData.epin.toUpperCase(),
          },
        }
      );

      if (regError || !regData?.success) {
        logError("Registration error", regError);
        toast.error("Erreur lors de la création du profil");
        return;
      }


      toast.success("Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.");
      onOpenChange(false);
    } catch (error) {
      logError("Registration error", error);
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
                UNITICASH
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
              aria-label="Fermer"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mobile Header */}
            <div className="md:hidden text-center mb-6">
              <Crown className="h-10 w-10 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-serif font-bold text-gradient-gold">
                UNITICASH
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* E-PIN Field - REQUIRED FIRST */}
              <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                <label htmlFor="reg-epin" className="block text-xs font-semibold text-primary mb-1.5 tracking-wide">
                  CODE E-PIN <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id="reg-epin" name="epin"
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
                    <label htmlFor="reg-referralUsername" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      NOM D'UTILISATEUR PARRAIN <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="reg-referralUsername" name="referralUsername"
                      placeholder="Entrer le nom du parrain"
                      value={formData.referralUsername}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-position" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      POSITION <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="reg-position" name="position"
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
                    <label htmlFor="reg-firstName" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      PRÉNOM <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="reg-firstName" name="firstName"
                      placeholder="Entrer votre prénom"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-lastName" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      NOM <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="reg-lastName" name="lastName"
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
                  <label htmlFor="reg-username" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    NOM D'UTILISATEUR <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="reg-username" name="username"
                    placeholder="Choisir un nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                {/* Row 4: Email */}
                <div className="mb-4">
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    EMAIL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="reg-email" name="email"
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
                    <label htmlFor="reg-password" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      MOT DE PASSE <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="reg-password" name="password"
                      type="password"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-confirmPassword" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                      CONFIRMER <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="reg-confirmPassword" name="confirmPassword"
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
                      onOpenChange(false);
                      onSwitchToLogin?.();
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
