import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { LobbyPlayer } from "@/types/lobby";
import { roleDescription, Role } from "@/types/game";

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

  // Prefer the server-provided role goal; fall back to local roleGoals mapping
  const roleDescriptionText =
    myPlayer.role_description ||
    (myPlayer.role ? roleDescription[myPlayer.role as Role as Role] : "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Your Secret Role</h2>
          <p className="text-muted-foreground">
            View your role and prepare for the guessing phase
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
                    Your Role:
                  </p>
                  <p className="text-4xl font-bold text-primary-foreground">
                    {myPlayer.role}
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-md">
                  <p className="text-sm text-primary-foreground/80 mb-1">
                    Your Role Description:
                  </p>
                  <p className="text-sm text-primary-foreground leading-relaxed">
                    {roleDescriptionText}
                  </p>
                </div>

                <div className="bg-secondary/5 p-4 rounded-md">
                  <p className="text-sm text-secondary-foreground/80 mb-1">
                    Guessing Objective
                  </p>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    During the guessing phase your goal is to correctly identify
                    other players' roles. Be strategic — each correct guess
                    helps increase your score and brings you closer to winning.
                  </p>
                </div>
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
            Ready for Guessing Phase
          </Button>
        )}
      </div>
    </div>
  );
};
