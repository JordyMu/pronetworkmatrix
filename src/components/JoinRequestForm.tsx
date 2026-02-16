import { useState } from "react";
import { Send, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JoinRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinRequestForm = ({ open, onOpenChange }: JoinRequestFormProps) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    referral_name: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("join_requests").insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        referral_name: formData.referral_name || null,
        message: formData.message || null,
      });

      if (error) {
        console.error("Join request error:", error);
        toast.error("Erreur lors de l'envoi de la demande");
        return;
      }

      setSubmitted(true);
      toast.success("Demande envoyée avec succès!");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setSubmitted(false);
      setFormData({ full_name: "", email: "", phone: "", referral_name: "", message: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background border-primary/30">
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gradient-gold mb-2">
                Demande Envoyée!
              </h3>
              <p className="text-muted-foreground mb-6">
                Nous avons reçu votre demande. Un administrateur vous contactera bientôt avec votre code e-pin.
              </p>
              <Button onClick={handleClose} className="bg-gradient-gold text-primary-foreground">
                Fermer
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gradient-gold mb-1">
                  Demande d'Adhésion
                </h3>
                <p className="text-sm text-muted-foreground">
                  Remplissez ce formulaire et nous vous enverrons un code e-pin
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    NOM COMPLET <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="full_name"
                    placeholder="Votre nom complet"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    EMAIL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    TÉLÉPHONE
                  </label>
                  <Input
                    name="phone"
                    placeholder="+243 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    NOM DU PARRAIN
                  </label>
                  <Input
                    name="referral_name"
                    placeholder="Qui vous a recommandé?"
                    value={formData.referral_name}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
                    MESSAGE
                  </label>
                  <textarea
                    name="message"
                    placeholder="Un message (optionnel)"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="flex w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90"
                >
                  {isLoading ? "Envoi..." : "Envoyer Ma Demande"}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRequestForm;
