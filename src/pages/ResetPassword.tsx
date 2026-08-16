import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Seo from "@/components/Seo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      toast.error("Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.");
      return;
    }
    toast.success("Mot de passe mis à jour !");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Seo
        title="Réinitialiser le mot de passe | UNITICASH"
        description="Définissez un nouveau mot de passe pour votre compte UNITICASH."
        path="/reset-password"
        noindex
      />
      <div className="w-full max-w-md border border-primary/30 rounded-xl p-8 bg-card">
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gradient-gold">UNITICASH</h1>
          <p className="text-muted-foreground mt-2">Choisissez un nouveau mot de passe</p>
        </div>

        {!ready ? (
          <p className="text-center text-sm text-muted-foreground">
            Ouvrez cette page depuis le lien reçu par e-mail pour réinitialiser votre mot de passe.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                NOUVEAU MOT DE PASSE
              </label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                CONFIRMER LE MOT DE PASSE
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90"
            >
              {isLoading ? "MISE À JOUR..." : "METTRE À JOUR"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
