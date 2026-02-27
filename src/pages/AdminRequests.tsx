import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, LogOut, ArrowLeft, Check, X, Clock, Mail, Phone, User, MessageSquare, Loader2, Eye, Copy, CheckCheck, Users, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  const [totalMembers, setTotalMembers] = useState(0);

  // E-PIN preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewEpin, setPreviewEpin] = useState<string | null>(null);
  const [previewRequestId, setPreviewRequestId] = useState<string | null>(null);
  const [previewRequestName, setPreviewRequestName] = useState<string>("");
  const [previewRequestEmail, setPreviewRequestEmail] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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
    const fetchData = async () => {
      // Fetch requests
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

      // Fetch total registered members count
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (!countError && count !== null) {
        setTotalMembers(count);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  const handleGeneratePreview = async (req: JoinRequest) => {
    setIsGenerating(true);
    setPreviewRequestId(req.id);
    setPreviewRequestName(req.full_name);
    setPreviewRequestEmail(req.email);
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
          body: JSON.stringify({ requestId: req.id, action: "generate" }),
        }
      );
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setPreviewEpin(result.epinCode);
      setPreviewOpen(true);
    } catch (error: any) {
      console.error("Error generating e-pin:", error);
      toast.error(error.message || "Erreur lors de la génération de l'E-PIN");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEpin = async () => {
    if (!previewEpin) return;
    await navigator.clipboard.writeText(previewEpin);
    setCopied(true);
    toast.success("E-PIN copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveAfterCopy = async () => {
    if (!previewRequestId) return;
    const { error } = await supabase
      .from("join_requests")
      .update({ status: "approved", admin_notes: `E-PIN: ${previewEpin} (copié manuellement)` })
      .eq("id", previewRequestId);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === previewRequestId ? { ...r, status: "approved" } : r))
    );
    toast.success("Demande approuvée !");
    setPreviewOpen(false);
    setPreviewEpin(null);
    setPreviewRequestId(null);
  };

  const updateStatus = async (id: string, status: string) => {
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
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMembers}</p>
                <p className="text-xs text-muted-foreground">Membres inscrits</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approuvées</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Rejetées</p>
              </div>
            </CardContent>
          </Card>
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
                      <Button
                        size="sm"
                        onClick={() => handleGeneratePreview(req)}
                        disabled={isGenerating && previewRequestId === req.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isGenerating && previewRequestId === req.id ? (
                          <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Génération...</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-1" />Générer & Prévisualiser E-PIN</>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, "rejected")} disabled={isGenerating} className="border-destructive/50 text-destructive hover:bg-destructive/10">
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

      {/* E-PIN Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Prévisualisation E-PIN</DialogTitle>
            <DialogDescription className="text-center">
              Vérifiez l'E-PIN avant de l'envoyer à <strong>{previewRequestName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{previewRequestName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{previewRequestEmail}</span>
              </div>
            </div>
            <div className="bg-card border-2 border-primary/30 rounded-lg p-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">E-PIN généré</p>
              <span className="text-3xl font-mono font-bold tracking-[6px] text-primary">
                {previewEpin}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Copiez ce code et transmettez-le manuellement au demandeur.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleCopyEpin} variant="outline">
              {copied ? (
                <><CheckCheck className="h-4 w-4 mr-1" />Copié !</>
              ) : (
                <><Copy className="h-4 w-4 mr-1" />Copier E-PIN</>
              )}
            </Button>
            <Button onClick={handleApproveAfterCopy} className="bg-green-600 hover:bg-green-700 text-white">
              <Check className="h-4 w-4 mr-1" />Marquer comme approuvée
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
