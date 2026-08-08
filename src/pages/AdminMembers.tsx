import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, LogOut, ArrowLeft, Loader2, Users, Search, Mail, Phone, UserPlus, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  referred_by: string | null;
  epin_used: string | null;
  created_at: string;
}

const AdminMembers = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const { isAdmin, isCheckingAdmin } = useAdminStatus(user?.id);
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "1-4" | "5-7">("all");
  const [matrixFilter, setMatrixFilter] = useState<"all" | "2x2" | "2x3">("all");

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/");
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && !isCheckingAdmin && isAuthenticated && !isAdmin) {
      toast.error("Accès non autorisé");
      navigate("/dashboard");
    }
  }, [loading, isCheckingAdmin, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des membres");
      } else {
        setMembers((data as Profile[]) || []);
      }
      setIsLoading(false);
    };
    fetchMembers();
  }, [isAdmin]);

  const byId = useMemo(() => {
    const map: Record<string, Profile> = {};
    members.forEach((m) => (map[m.id] = m));
    return map;
  }, [members]);

  const childrenOf = useMemo(() => {
    const map: Record<string, Profile[]> = {};
    members.forEach((m) => {
      if (m.referred_by) {
        map[m.referred_by] = map[m.referred_by] || [];
        map[m.referred_by].push(m);
      }
    });
    return map;
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone || "").toLowerCase().includes(q)
    );
  }, [members, query]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || isCheckingAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-gradient-gold">ProNetwork</span>
          </a>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/requests")} aria-label="Voir les demandes d'adhésion">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Demandes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              aria-label="Se déconnecter"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Membres <span className="text-gradient-gold">inscrits</span>
          </h1>
          <p className="text-muted-foreground">
            {members.length} membre{members.length !== 1 ? "s" : ""} enregistré{members.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, email ou téléphone…"
                className="pl-9"
                aria-label="Rechercher un membre"
              />
            </div>
          </CardContent>
        </Card>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              Aucun membre trouvé.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((m) => {
              const sponsor = m.referred_by ? byId[m.referred_by] : null;
              const referrals = childrenOf[m.id] || [];
              return (
                <Card key={m.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-lg">{m.full_name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {m.position && <Badge variant="secondary">{m.position}</Badge>}
                        <Badge variant="outline">
                          {referrals.length} filleul{referrals.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid sm:grid-cols-2 gap-2 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {m.email}
                      </span>
                      {m.phone && (
                        <span className="flex items-center gap-2">
                          <Phone className="h-4 w-4" /> {m.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Inscrit le {new Date(m.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Parrain : {sponsor ? sponsor.full_name : "—"}
                      </span>
                    </div>

                    {m.epin_used && (
                      <p className="text-muted-foreground">
                        E-PIN utilisé : <span className="font-mono text-foreground">{m.epin_used}</span>
                      </p>
                    )}

                    {referrals.length > 0 && (
                      <div className="border-t border-border/50 pt-3">
                        <p className="font-medium mb-2">Filleuls directs</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {referrals.map((r) => (
                            <li key={r.id}>
                              • {r.full_name} — {r.email}
                              {r.position ? ` (${r.position})` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMembers;
