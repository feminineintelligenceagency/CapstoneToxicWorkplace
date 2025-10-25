import { GameProvider } from '@/contexts/GameContext';
import { GameSetup } from '@/components/GameSetup';
import { RoleReveal } from '@/components/RoleReveal';
import { GuessingPhase } from '@/components/GuessingPhase';
import { Results } from '@/components/Results';
import { useGame } from '@/contexts/GameContext';

const SoloGame = () => {
  const { gameState, nextPhase, makeGuess, resetGame } = useGame();

  const handleNext = () => {
    nextPhase();
  };

  const handleGuess = (targetId: string, role: any) => {
    makeGuess(Number(targetId), role);
  };

  const handleReset = () => {
    resetGame();
  };

  switch (gameState.phase) {
    case 'setup':
      return <GameSetup />;
    case 'roleReveal':
      return <RoleReveal 
        players={gameState.players} 
        myPlayerId={1} 
        onNext={handleNext} 
      />;
    case 'guessing':
      return <GuessingPhase 
        lobby={{ current_player_index: gameState.currentPlayerIndex, current_guess_target: gameState.currentGuessTarget } as any}
        players={gameState.players} 
        myPlayerId={1} 
        isMyTurn={gameState.currentPlayerIndex === 0} 
        onGuess={handleGuess} 
        onNext={handleNext} 
      />;
    case 'results':
      return <Results 
        players={gameState.players} 
        onReset={handleReset} 
      />;
    default:
      return <GameSetup />;
  }
};

const Index = () => {
  return (
    <GameProvider>
      <SoloGame />
    </GameProvider>
  );
};

export default Index;
