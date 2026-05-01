import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLobby } from '@/hooks/useLobby';
import { RoleReveal } from '@/components/RoleReveal';
import { RoleplayTimer } from '@/components/RoleplayTimer';
import { GuessingPhase } from '@/components/GuessingPhase';
import { Results } from '@/components/Results';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prepareTranscriptsForGrading } from '@/llm/prepareTranscriptsForGrading';
import { gradeRoleplayTranscripts } from '@/llm/gradeRoleplayTranscripts';

const Game = () => {
  const [searchParams] = useSearchParams();
  const lobbyCode = searchParams.get('code');
  const navigate = useNavigate();
  const { lobby, players, myPlayerId } = useLobby(lobbyCode || undefined);

  const [gradeSummaries, setGradeSummaries] = useState<Record<string, string>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);

  useEffect(() => {
    if (!lobbyCode) {
      navigate('/');
    }
  }, [lobbyCode, navigate]);

  useEffect(() => {
    if (lobby?.current_phase !== 'results' || players.length === 0) return;
    if (Object.keys(gradeSummaries).length >= players.length) return;

    const runGrading = async () => {
      setIsGrading(true);
      setGradingError(null);
      try {
        const payload = prepareTranscriptsForGrading(players, {
          scenarioName: undefined,
          scenarioDescription: undefined,
        });

        const result = await gradeRoleplayTranscripts(payload);
        const summaries = Object.fromEntries(
          result.players.map((p) => [p.playerId, p.playerSummary ?? 'No summary from LLM'])
        );
        setGradeSummaries(summaries);
      } catch (err) {
        console.error('LLM grading failed', err);
        setGradingError(String(err));
      } finally {
        setIsGrading(false);
      }
    };

    runGrading();
  }, [lobby?.current_phase, players, gradeSummaries]);

  const playersWithGrading = useMemo(
    () => players.map((p) => ({
      ...p,
      roleplaySummary: gradeSummaries[p.id] ?? p.roleplaySummary,
    })),
    [players, gradeSummaries]
  );

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

  // Game phases with proper props
  const myPlayer = players.find(p => p.id === myPlayerId);
  const isMyTurn = myPlayer?.id === players[lobby.current_player_index]?.id;
  const hostPlayer = players.find(p => p.player_number === 1);
  const isHost = hostPlayer?.id === myPlayerId;


  if (gradingError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="gradient-card p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold">Grading error</h2>
          <p className="text-sm text-destructive">{gradingError}</p>
          <Button onClick={() => setGradingError(null)}>Retry</Button>
        </Card>
      </div>
    );
  }

  if (isGrading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Running LLM grading...</p>
        </div>
      </div>
    );
  }

  switch (lobby.current_phase) {
    case 'roleReveal':
      return <RoleReveal 
        players={players} 
          myPlayerId={myPlayerId}
          lobby={lobby}
          onNext={() => { }} // This should be handled by the lobby component
      />;
    case 'roleplay':
      return <RoleplayTimer 
        lobby={lobby} 
        isHost={isHost} 
        onTimerEnd={() => {}} // This should be handled by the lobby component
      />;
    case 'guessing':
      return <GuessingPhase 
        lobby={lobby}
        players={players} 
        myPlayerId={myPlayerId} 
        isMyTurn={isMyTurn}
        onGuess={() => {}} // This should be handled by the lobby component
        onNext={() => {}} // This should be handled by the lobby component
      />;
    case 'results':
      return <Results 
        players={playersWithGrading} 
        onReset={() => navigate('/')} 
      />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Unknown game phase</p>
        </div>
      );
  }
};

export default Game;
