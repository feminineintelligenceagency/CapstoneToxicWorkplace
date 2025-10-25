import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BASE_ROLES, Role } from '@/types/game';
import { Lobby, LobbyPlayer } from '@/types/lobby';
import { Users } from 'lucide-react';

interface GuessingPhaseProps {
  lobby: Lobby;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  isMyTurn: boolean;
  onGuess: (targetId: string, role: Role) => void;
  onNext: () => void;
}

export const GuessingPhase = ({ lobby, players, myPlayerId, isMyTurn, onGuess, onNext }: GuessingPhaseProps) => {
  const currentPlayer = players[lobby.current_player_index];
  const targetPlayer = players[lobby.current_guess_target];
  const myPlayer = players.find((p) => p.id === myPlayerId);

  const handleGuess = (role: Role) => {
    if (!targetPlayer || !isMyTurn) return;
    onGuess(targetPlayer.id, role);
    // Don't call onNext here - let the parent component handle turn advancement
  };

  if (!currentPlayer || !targetPlayer || !myPlayer) return null;

  const guessedPlayers = Object.keys(myPlayer.guesses).length;
  const totalToGuess = players.length - 1;

  if (!isMyTurn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h2 className="text-3xl font-bold">Waiting...</h2>
          <p className="text-xl text-muted-foreground">
            {currentPlayer.player_name} is making their guess
          </p>
          <p className="text-sm text-muted-foreground">
            Guessing {targetPlayer.player_name}'s role
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Your turn • Guessed {guessedPlayers}/{totalToGuess}
            </span>
          </div>
          <h2 className="text-3xl font-bold">Guess {targetPlayer.player_name}'s Role</h2>
        </div>

        <Card className="gradient-card p-8 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BASE_ROLES.map((role) => (
              <Button
                key={role}
                onClick={() => handleGuess(role)}
                variant="secondary"
                size="lg"
                className="h-20 text-base font-semibold hover:gradient-accent hover:text-accent-foreground transition-smooth"
              >
                {role}
              </Button>
            ))}
          </div>
        </Card>

        <div className="flex justify-center">
          <div className="text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full">
            Click a role to make your guess
          </div>
        </div>
      </div>
    </div>
  );
};
