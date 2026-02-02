import { User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NetworkMember {
  profile_id: string;
  full_name: string;
  email: string;
  member_position: string | null;
  generation: number;
  parent_id: string | null;
}

interface NetworkTreeProps {
  network: NetworkMember[];
  isLoading: boolean;
}

const NetworkTree = ({ network, isLoading }: NetworkTreeProps) => {
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient-gold">
            <Users className="h-5 w-5 text-primary" />
            Mon Réseau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group by generation
  const generations = network.reduce((acc, member) => {
    const gen = member.generation;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(member);
    return acc;
  }, {} as Record<number, NetworkMember[]>);

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-gold">
          <Users className="h-5 w-5 text-primary" />
          Mon Réseau ({network.length} membres)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {network.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Aucun membre dans votre réseau</p>
            <p className="text-sm mt-2">
              Parrainez de nouveaux membres pour commencer à gagner
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(generations)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([gen, members]) => (
                <div key={gen}>
                  <h4 className="text-sm font-semibold text-primary mb-3">
                    Génération {gen} ({members.length} membres)
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => (
                      <div
                        key={member.profile_id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                          {member.member_position && (
                            <span className="text-xs px-2 py-0.5 bg-primary/20 rounded text-primary">
                              {member.member_position === "gauche" ? "Gauche" : "Droite"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkTree;
