import { GameProvider } from "@/contexts/GameContext";
import { GameSetup } from "@/components/GameSetup";
import { RoleReveal } from "@/components/RoleReveal";
import { RoleplayTimer } from "@/components/RoleplayTimer";
import { GuessingPhase } from "@/components/GuessingPhase";
import { Results } from "@/components/Results";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/types/game";
import { LobbyPlayer, Lobby } from "@/types/lobby";
import { useState, useEffect } from "react";

const SoloGame = () => {
  const { gameState, nextPhase, makeGuess, resetGame } = useGame();
  const [roleplayTimerEnd, setRoleplayTimerEnd] = useState<string | null>(null);

  // Set timer when transitioning to roleplay phase
  useEffect(() => {
    if (gameState.phase === "roleplay" && !roleplayTimerEnd) {
      setRoleplayTimerEnd(new Date(Date.now() + 5 * 60 * 1000).toISOString());
    } else if (gameState.phase !== "roleplay") {
      setRoleplayTimerEnd(null);
    }
  }, [gameState.phase, roleplayTimerEnd]);

  // Convert Player[] to LobbyPlayer[] for component compatibility
  const convertPlayersToLobbyPlayers = (players: Player[]): LobbyPlayer[] => {
    return players.map((player, index) => ({
      id: player.id.toString(),
      lobby_id: "solo",
      player_number: index + 1,
      player_name: player.name,
      role: player.roleDetails.personality, // Use personality as the role identifier
      role_description: player.roleDetails.roleDescription,
      nicknames: player.roleDetails.roleName, // Use roleName as nickname
      guidelines: player.roleDetails.guidelines,
      guesses: Object.fromEntries(
        Object.entries(player.guesses).map(([key, value]) => [
          key.toString(),
          value, // value is now a personality string
        ]),
      ),
      score: player.score,
        guess_score: player.score,
        role_score: 0,
        overall_score: player.score,
        transcripts: [],
      joined_at: new Date().toISOString(),
    }));
  };

  const handleNext = () => {
    nextPhase();
  };

  const handleTimerEnd = () => {
    nextPhase();
  };

  const handleGuess = (targetId: string, personality: string) => {
    makeGuess(Number(targetId), personality);
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
        <RoleReveal players={lobbyPlayers} myPlayerId="1" onNext={handleNext} onReady={() => {}} />
      );
    case "roleplay": {
      // For solo play, create a mock lobby with timer
      if (!roleplayTimerEnd) {
        // Timer not set yet, wait for useEffect to set it
        return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
      }
      const soloLobby: Lobby = {
        id: "solo",
        code: "SOLO",
        host_id: "1",
        status: "in_progress",
        num_players: 1,
        current_phase: "roleplay",
        current_player_index: 0,
        current_guess_target: 0,
        roleplay_timer_end: roleplayTimerEnd,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return (
        <RoleplayTimer
          lobby={soloLobby}
          players={lobbyPlayers}
          isHost={true}
          onTimerEnd={handleTimerEnd}
        />
      );
    }
    case "guessing": {
      // Get available personalities from the selected scenario
      const availablePersonalities = gameState.selectedScenario?.roles.map((r) => r.personality) || [];
      const guessingLobby: Lobby = {
        id: "guessing",
        code: gameState.lobbyCode ?? "",
        host_id: "1",
        status: "in_progress",
        num_players: lobbyPlayers.length,
        current_phase: "guessing",
        current_player_index: gameState.currentPlayerIndex,
        current_guess_target: gameState.currentGuessTarget,
        roleplay_timer_end: gameState.roleplayTimerEnd || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return (
        <GuessingPhase
          lobby={guessingLobby}
          players={lobbyPlayers}
          myPlayerId="1"
          isMyTurn={gameState.currentPlayerIndex === 0}
          onGuess={handleGuess}
          onNext={handleNext}
          availablePersonalities={availablePersonalities}
        />
      );
    }
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
