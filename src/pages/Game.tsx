import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLobby } from '@/hooks/useLobby';
import { RoleReveal } from '@/components/RoleReveal';
import { GuessingPhase } from '@/components/GuessingPhase';
import { Results } from '@/components/Results';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Game = () => {
  const [searchParams] = useSearchParams();
  const lobbyCode = searchParams.get('code');
  const navigate = useNavigate();
  const { lobby, players } = useLobby(lobbyCode || undefined);

  useEffect(() => {
    if (!lobbyCode) {
      navigate('/');
    }
  }, [lobbyCode, navigate]);

  if (!lobby || players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (lobby.status !== 'in_progress') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="gradient-card p-8 max-w-md w-full text-center space-y-4">
          <p className="text-muted-foreground">Game not started yet</p>
          <Button onClick={() => navigate(`/lobby/${lobbyCode}`)}>
            Return to Lobby
          </Button>
        </Card>
      </div>
    );
  }

  // Game phases will be implemented with multiplayer logic
  switch (lobby.current_phase) {
    case 'roleReveal':
      return <RoleReveal />;
    case 'guessing':
      return <GuessingPhase />;
    case 'results':
      return <Results />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Unknown game phase</p>
        </div>
      );
  }
};

export default Game;
