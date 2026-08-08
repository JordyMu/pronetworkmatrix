import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, LogOut, User, Copy, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNetworkStats } from "@/hooks/useNetworkStats";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import NetworkTree from "@/components/dashboard/NetworkTree";
import GenerationStats from "@/components/dashboard/GenerationStats";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();
  const { isAdmin } = useAdminStatus(user?.id);
  const { network, stats, totalMembers, totalRewards, isLoading } = useNetworkStats(
    profile?.id
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const copyReferralLink = () => {
    if (profile?.id) {
      const link = `${window.location.origin}/?ref=${profile.id}`;
      navigator.clipboard.writeText(link);
      toast.success("Lien de parrainage copié!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-gradient-gold">
              ProNetwork
            </span>
          </a>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin/requests")}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Demandes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin/members")}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Membres
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Bienvenue,{" "}
            <span className="text-gradient-gold">{profile.full_name}</span>
          </h1>
          <p className="text-muted-foreground">
            Gérez votre réseau et suivez vos gains
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Membres Totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gradient-gold">{totalMembers}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gains Totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gradient-gold">
                {new Intl.NumberFormat("fr-CD").format(totalRewards)} CDF
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lien de Parrainage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={copyReferralLink}
                variant="outline"
                className="w-full border-primary/50 hover:bg-primary/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier le lien
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient-gold">
              <User className="h-5 w-5 text-primary" />
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Stats */}
        <div className="mb-8">
          <GenerationStats
            stats={stats}
            totalRewards={totalRewards}
            isLoading={isLoading}
          />
        </div>

        {/* Network Tree */}
        <NetworkTree network={network} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Dashboard;
