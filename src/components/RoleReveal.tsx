import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle, Users } from "lucide-react";
import { LobbyPlayer } from "@/types/lobby";

interface RoleRevealProps {
  players: LobbyPlayer[];
  myPlayerId: string | null;
  onNext: () => void;
}

export const RoleReveal = ({
  players,
  myPlayerId,
  onNext,
}: RoleRevealProps) => {
  const [revealed, setRevealed] = useState(false);
  const myPlayer = players.find((p) => p.id === myPlayerId);

  if (!myPlayer) return null;

  // Use the role description from the player data (converted from scenario roleDetails)
  const roleDescriptionText = myPlayer.role_description || "";
  const roleName = myPlayer.nicknames || myPlayer.role || ""; // roleName is stored in nicknames field
  const personality = myPlayer.role || "";
  const guidelines = myPlayer.guidelines || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Your Secret Identity</h1>
          <p className="text-lg text-muted-foreground">
            Read your role carefully and prepare for the roleplay phase
          </p>
        </div>

        <Card className="p-8 shadow-lg border-secondary/20">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <Button
                onClick={() => setRevealed(!revealed)}
                size="lg"
                className="w-full h-12 text-base font-semibold"
                variant={revealed ? "destructive" : "default"}
              >
                {revealed ? (
                  <>
                    <Eye className="mr-2 h-5 w-5" />
                    Hide Role
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-5 w-5" />
                    Reveal My Role
                  </>
                )}
              </Button>
            </div>

            {revealed && myPlayer.role && (
              <div className="animate-in fade-in duration-500 space-y-6">
                {/* Role Name Section */}
                <div className="border-2 border-primary/20 rounded-lg p-8 bg-primary/2 text-center space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    🔒 Your Secret Personality (Keep This Hidden)
                  </p>
                  <p className="text-5xl font-bold text-primary tracking-tight">
                    {personality}
                  </p>
                  {roleName && (
                    <p className="text-lg text-foreground pt-2">
                      Introduces yourself as: <span className="font-bold text-primary">{roleName}</span> <span className="text-xs text-muted-foreground">(PUBLIC)</span>
                    </p>
                  )}
                </div>

                {/* Description & Objective Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="p-6 border-secondary/30 bg-secondary/5 space-y-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-secondary" />
                      <p className="font-semibold text-foreground">Your Personality</p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {roleDescriptionText}
                    </p>
                  </Card>

                  <Card className="p-6 border-tertiary/30 bg-tertiary/5 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-tertiary" />
                      <p className="font-semibold text-foreground">Your Objective</p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      During guessing phase, identify other players' personalities. Each correct guess earns points — be strategic!
                    </p>
                  </Card>
                </div>

                {/* Guidelines Section */}
                {guidelines.length > 0 && (
                  <Card className="p-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30 space-y-4">
                    <p className="font-semibold text-foreground text-lg">
                      🎭 Roleplay Guidelines
                    </p>
                    <ul className="space-y-3">
                      {guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start text-sm text-foreground/90">
                          <span className="mr-3 font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                            {index + 1}.
                          </span>
                          <span className="leading-relaxed">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            )}
          </div>
        </Card>

        {revealed && (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full mt-8 h-12 text-base font-semibold"
            variant="secondary"
          >
            Ready for Roleplay Phase →
          </Button>
        )}
      </div>
    </div>
  );
};
