import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { LobbyPlayer } from '@/types/lobby';

interface RoleRevealProps {
  players: LobbyPlayer[];
  myPlayerId: string | null;
  onNext: () => void;
}

export const RoleReveal = ({ players, myPlayerId, onNext }: RoleRevealProps) => {
  const [revealed, setRevealed] = useState(false);
  const myPlayer = players.find((p) => p.id === myPlayerId);

  if (!myPlayer) return null;

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
                variant={revealed ? 'accent' : 'game'}
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
              <div className="gradient-primary p-6 rounded-lg shadow-glow animate-in fade-in duration-500">
                <p className="text-sm text-primary-foreground/80 mb-2">Your Role:</p>
                <p className="text-4xl font-bold text-primary-foreground">
                  {myPlayer.role}
                </p>
              </div>
            )}
          </div>
        </Card>

        {revealed && (
          <Button onClick={onNext} variant="secondary" size="lg" className="w-full">
            Ready for Guessing Phase
          </Button>
        )}
      </div>
    </div>
  );
};
