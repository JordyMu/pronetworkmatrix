import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, LogOut, ArrowLeft, Check, X, Clock, Mail, Phone, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JoinRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  referral_name: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const AdminRequests = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(!!data);
      if (!data) {
        toast.error("Accès non autorisé");
        navigate("/dashboard");
      }
    };
    if (user) checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        toast.error("Erreur lors du chargement");
      } else {
        setRequests(data || []);
      }
      setIsLoading(false);
    };
    fetchRequests();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    if (status === "approved") {
      // Use edge function to generate e-pin and send email
      setProcessingId(id);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-epin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ requestId: id }),
          }
        );
        const result = await res.json();
        if (!result.success) throw new Error(result.error);

        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
        );
        toast.success("E-PIN généré et envoyé par email !");
      } catch (error: any) {
        console.error("Error approving:", error);
        toast.error(error.message || "Erreur lors de l'approbation");
      } finally {
        setProcessingId(null);
      }
      return;
    }

    const { error } = await supabase
      .from("join_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast.success("Demande rejetée");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500/50 text-yellow-500"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-500/50 text-green-500"><Check className="h-3 w-3 mr-1" />Approuvée</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-destructive/50 text-destructive"><X className="h-3 w-3 mr-1" />Rejetée</Badge>;
      default:
        return null;
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-primary" />
              <span className="text-xl font-serif font-bold text-gradient-gold">ProNetwork</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Demandes d'<span className="text-gradient-gold">Adhésion</span>
          </h1>
          <p className="text-muted-foreground">
            {pendingCount} demande{pendingCount !== 1 ? "s" : ""} en attente
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : requests.length === 0 ? (
          <Card className="border-primary/20 bg-card/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune demande pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <Card key={req.id} className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {req.full_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${req.email}`} className="hover:text-primary transition-colors">{req.email}</a>
                    </div>
                    {req.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{req.phone}</span>
                      </div>
                    )}
                    {req.referral_name && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>Parrain: {req.referral_name}</span>
                      </div>
                    )}
                    {req.message && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5 mt-0.5" />
                        <span>{req.message}</span>
                      </div>
                    )}
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(req.id, "approved")} disabled={processingId === req.id} className="bg-green-600 hover:bg-green-700 text-white">
                        {processingId === req.id ? (
                          <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Envoi...</>
                        ) : (
                          <><Check className="h-4 w-4 mr-1" />Approuver & Envoyer E-PIN</>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, "rejected")} disabled={!!processingId} className="border-destructive/50 text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRequests;
