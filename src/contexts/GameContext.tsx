/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  GameState,
  Player,
  BASE_SCENARIOS,
  RoleDetails,
} from "@/types/game";

interface GameContextType {
  gameState: GameState;
  startGame: (numPlayers: number, scenarioIndex?: number) => void;
  nextPhase: () => void;
  makeGuess: (targetId: number, personality: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const initialGameState: GameState = {
  phase: "setup",
  players: [],
  currentPlayerIndex: 0,
  currentGuessTarget: 0,
  selectedScenario: null,
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGame = (numPlayers: number, scenarioIndex: number = 0) => {
    // Select scenario (default to first one, or use provided index)
    const selectedScenario = BASE_SCENARIOS[scenarioIndex];
    if (!selectedScenario) {
      console.error("Invalid scenario index");
      return;
    }

    // Get available roles from the scenario
    const availableRoles = [...selectedScenario.roles];
    
    // If we need more roles than available, duplicate them
    const rolesPool: RoleDetails[] = [];
    while (rolesPool.length < numPlayers) {
      rolesPool.push(...availableRoles);
    }
    
    // Shuffle and assign roles
    const assignedRoles = shuffle(rolesPool.slice(0, numPlayers));

    const players: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      roleDetails: assignedRoles[i],
      guesses: {} as Record<number, string>,
      score: 0,
    }));

    setGameState({
      phase: "roleReveal",
      players,
      currentPlayerIndex: 0,
      currentGuessTarget: 0,
      selectedScenario,
    });
  };

  const nextPhase = () => {
    setGameState((prev) => {
      if (prev.phase === "roleReveal") {
        return {
          ...prev,
          phase: "roleplay",
        };
      }

      if (prev.phase === "roleplay") {
        return {
          ...prev,
          phase: "guessing",
          currentPlayerIndex: 0,
          currentGuessTarget: 1,
        };
      }

      if (prev.phase === "guessing") {
        const currentPlayer = prev.players[prev.currentPlayerIndex];
        let nextTarget = prev.currentGuessTarget;

        // Find next valid target
        while (
          nextTarget < prev.players.length &&
          (nextTarget === prev.currentPlayerIndex ||
            currentPlayer.guesses[prev.players[nextTarget].id] !== undefined)
        ) {
          nextTarget++;
        }

        // If we've guessed everyone for this player, move to next player
        if (nextTarget >= prev.players.length) {
          const nextPlayerIndex = prev.currentPlayerIndex + 1;

          if (nextPlayerIndex >= prev.players.length) {
            // Calculate scores
            const updatedPlayers = prev.players.map((p) => {
              let score = 0;
              Object.entries(p.guesses).forEach(([targetIdStr, guess]) => {
                const targetId = Number(targetIdStr);
                const target = prev.players.find((pl) => pl.id === targetId);
                // Check if the guessed personality matches the target's role personality
                if (target && guess === target.roleDetails.personality) {
                  score++;
                }
              });
              return { ...p, score };
            });

            return { ...prev, phase: "results", players: updatedPlayers };
          }

          // Move to next player
          const nextValidTarget = nextPlayerIndex === 0 ? 1 : 0;
          return {
            ...prev,
            currentPlayerIndex: nextPlayerIndex,
            currentGuessTarget: nextValidTarget,
          };
        }

        return { ...prev, currentGuessTarget: nextTarget };
      }

      return prev;
    });
  };

  const makeGuess = (targetId: number, personality: string) => {
    setGameState((prev) => {
      const updatedPlayers = [...prev.players];
      const currentPlayer = updatedPlayers[prev.currentPlayerIndex];
      currentPlayer.guesses[targetId] = personality;

      // After making a guess, advance the turn
      const updatedState = { ...prev, players: updatedPlayers };

      // Calculate next target/player
      let nextTarget = prev.currentGuessTarget;

      // Find next valid target (skip self and already guessed players)
      while (
        nextTarget < updatedPlayers.length &&
        (nextTarget === prev.currentPlayerIndex ||
          currentPlayer.guesses[updatedPlayers[nextTarget].id] !== undefined)
      ) {
        nextTarget++;
      }

      if (nextTarget >= updatedPlayers.length) {
        // Current player has guessed everyone, move to next player
        const nextPlayerIndex = prev.currentPlayerIndex + 1;

        if (nextPlayerIndex >= updatedPlayers.length) {
          // All players have finished guessing, calculate scores and end game
          const playersWithScores = updatedPlayers.map((p) => {
            let score = 0;
            Object.entries(p.guesses).forEach(([targetIdStr, guess]) => {
              const targetId = Number(targetIdStr);
              const target = updatedPlayers.find((pl) => pl.id === targetId);
              // Check if the guessed personality matches the target's role personality
              if (target && guess === target.roleDetails.personality) {
                score++;
              }
            });
            return { ...p, score };
          });

          return {
            ...updatedState,
            phase: "results",
            players: playersWithScores,
          };
        }

        // Move to next player
        const nextValidTarget = nextPlayerIndex === 0 ? 1 : 0;
        return {
          ...updatedState,
          currentPlayerIndex: nextPlayerIndex,
          currentGuessTarget: nextValidTarget,
        };
      } else {
        // Move to next target for current player
        return { ...updatedState, currentGuessTarget: nextTarget };
      }
    });
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{ gameState, startGame, nextPhase, makeGuess, resetGame }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
