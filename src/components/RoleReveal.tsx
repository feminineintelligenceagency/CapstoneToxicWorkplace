import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Your Toxic Personality</h2>
          <p className="text-muted-foreground">
            View your persona and prepare for the roleplay phase
          </p>
        </div>

        <Card className="gradient-card p-8 shadow-card">
          <div className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setRevealed(!revealed)}
                variant={revealed ? "accent" : "game"}
                size="lg"
                className="w-full"
              >
                {revealed ? (
                  <>
                    <Eye className="mr-2" />
                    Hide Role
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2" />
                    Reveal My Role
                  </>
                )}
              </Button>
            </div>

            {revealed && myPlayer.role && (
              <div className="gradient-primary p-6 rounded-lg shadow-glow animate-in fade-in duration-500 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-primary-foreground/80 mb-2">
                    Your Personality (Do not reveal this to anyone):
                  </p>
                  <p className="text-4xl font-bold text-primary-foreground">
                    {personality}
                  </p>
                  {roleName && (
                    <p className="text-lg text-primary-foreground/80 mt-2">
                      {roleName} <label className="text-lg">(PUBLIC)</label>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-primary-foreground/80 mb-1">
                      Your Personality Description:
                    </p>
                    <p className="text-sm text-primary-foreground leading-relaxed">
                      {roleDescriptionText}
                    </p>
                  </div>

                  <div className="bg-secondary/5 p-4 rounded-md">
                    <p className="text-sm text-primary-foreground/80 mb-1">
                      Guessing Objective
                    </p>
                    <p className="text-sm text-primary-foreground leading-relaxed">
                      During the guessing phase your goal is to correctly identify
                      other players' personalities. Be strategic — each correct guess
                      helps increase your score and brings you closer to winning.
                    </p>
                  </div>
                </div>

                {guidelines.length > 0 && (
                  <div className="bg-accent/5 p-4 rounded-md border border-accent/20">
                    <p className="text-sm text-primary-foreground/80 mb-2 font-semibold">
                      Roleplay Guidelines:
                    </p>
                    <ul className="space-y-2">
                      {guidelines.map((guideline, index) => (
                        <li key={index} className="text-sm text-primary-foreground flex items-start">
                          <span className="mr-2 text-accent font-bold">•</span>
                          <span className="leading-relaxed">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {revealed && (
          <Button
            onClick={onNext}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Ready for Roleplay Phase
          </Button>
        )}
      </div>
    </div>
  );
};
