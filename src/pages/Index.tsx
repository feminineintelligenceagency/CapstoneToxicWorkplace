import { GameProvider } from "@/contexts/GameContext";
import { GameSetup } from "@/components/GameSetup";
import { RoleReveal } from "@/components/RoleReveal";
import { GuessingPhase } from "@/components/GuessingPhase";
import { Results } from "@/components/Results";
import { useGame } from "@/contexts/GameContext";
import { Player, Role } from "@/types/game";
import { LobbyPlayer } from "@/types/lobby";

const SoloGame = () => {
  const { gameState, nextPhase, makeGuess, resetGame } = useGame();

  // Convert Player[] to LobbyPlayer[] for component compatibility
  const convertPlayersToLobbyPlayers = (players: Player[]): LobbyPlayer[] => {
    return players.map((player, index) => ({
      id: player.id.toString(),
      lobby_id: "solo",
      player_number: index + 1,
      player_name: player.name,
      role: player.role,
      role_description: player.roleDescription,
      nicknames: player.nicknames,
      guesses: Object.fromEntries(
        Object.entries(player.guesses).map(([key, value]) => [
          key.toString(),
          value,
        ]),
      ),
      score: player.score,
      joined_at: new Date().toISOString(),
    }));
  };

  const handleNext = () => {
    nextPhase();
  };

  const handleGuess = (targetId: string, role: Role) => {
    makeGuess(Number(targetId), role);
    // Don't call handleNext here - makeGuess now handles turn advancement internally
  };

  const handleReset = () => {
    resetGame();
  };

  const lobbyPlayers = convertPlayersToLobbyPlayers(gameState.players);

  switch (gameState.phase) {
    case "setup":
      return <GameSetup />;
    case "roleReveal":
      return (
        <RoleReveal players={lobbyPlayers} myPlayerId="1" onNext={handleNext} />
      );
    case "guessing":
      return (
        <GuessingPhase
          lobby={
            {
              current_player_index: gameState.currentPlayerIndex,
              current_guess_target: gameState.currentGuessTarget,
            } as any
          }
          players={lobbyPlayers}
          myPlayerId="1"
          isMyTurn={gameState.currentPlayerIndex === 0}
          onGuess={handleGuess}
          onNext={handleNext}
        />
      );
    case "results":
      return <Results players={lobbyPlayers} onReset={handleReset} />;
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
