import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useLobby } from '@/hooks/useLobby';
import { useTranscription } from '@/hooks/useTranscription';
import { LobbyWaiting } from '@/components/LobbyWaiting';
import { RoleReveal } from '@/components/RoleReveal';
import { RoleplayTimer } from '@/components/RoleplayTimer';
import { GuessingPhase } from '@/components/GuessingPhase';
import { Results } from '@/components/Results';
import RoleSelection from '@/components/RoleSelection';
import { BASE_SCENARIOS } from '@/types/game';

const Lobby = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { lobby, players, myPlayerId, updateLobby, updatePlayer } = useLobby(code);
  const isRoleplayPhaseNow = lobby?.current_phase === 'roleplay';
  const { transcriptionsRef, getTranscriptions } = useTranscription(isRoleplayPhaseNow, myPlayerId);

  useEffect(() => { if (!code) navigate('/'); }, [code, navigate]);

  useEffect(() => {
    // Log transcriptions when roleplay phase ends (transitions to guessing)
    if (lobby && lobby.current_phase === 'guessing') {
      const transcriptions = getTranscriptions();
      console.log('📝 Roleplay Phase Transcriptions:', transcriptions);
    }
  }, [lobby?.current_phase, getTranscriptions]);

  const handleStartGame = async (selectedScenarioIndex?: number) => {
    if (!lobby || players.length < 2) return;
    // Use provided scenario index, or randomize if not provided
    let scenarioIndex = selectedScenarioIndex ?? lobby.scenario_index;
    if (scenarioIndex === undefined || scenarioIndex === null) {
      scenarioIndex = Math.floor(Math.random() * BASE_SCENARIOS.length);
    }
    // Move game into the role selection phase where players submit ranked ballots.
    await updateLobby({
      status: "in_progress",
      current_phase: "roleSelection",
      current_player_index: 0,
      scenario_index: scenarioIndex,
    });
  };

  const handleUpdateSettings = async (settings: {roleplay_timer_duration: number}) => {
    if (!lobby) return;
    await updateLobby({ roleplay_timer_duration: settings.roleplay_timer_duration });
  };

  const handleUpdateScenario = async (scenarioIndex: number) => {
    if (!lobby) return;
    await updateLobby({ scenario_index: scenarioIndex });
  };

  const handleNextPhase = async () => {
    if (!lobby || !players.length) return;
    if (lobby.current_phase === 'roleReveal') {
      // 1 minute timer for roleplay phase
      const durationMinutes = lobby.roleplay_timer_duration || 5;
      const timerEnd = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      await updateLobby({ 
        current_phase: 'roleplay', 
        roleplay_timer_end: timerEnd 
      });
      return;
    }
    if (lobby.current_phase === 'roleplay') {
      // Transition from roleplay to guessing phase
      await updateLobby({ 
        current_phase: 'guessing', 
        current_player_index: 0, 
        current_guess_target: 1 
      });
      return;
    }
    if (lobby.current_phase === 'guessing') {
      const cp = players[lobby.current_player_index];
      let nt = lobby.current_guess_target;
      while (nt < players.length && (nt === lobby.current_player_index || cp.guesses[players[nt].id])) nt++;
      if (nt >= players.length) {
        const npi = lobby.current_player_index + 1;
        if (npi >= players.length) {
          for (const p of players) {
            let s = 0;
            Object.entries(p.guesses).forEach(([tid, g]) => { 
              const t = players.find(x => x.id === tid); 
              // Compare guessed personality with target's role (personality)
              if (t && g === t.role) s++; 
            });
            await updatePlayer(p.id, { score: s });
          }
          await updateLobby({ current_phase: 'results', status: 'completed' });
          return;
        }
        await updateLobby({ current_player_index: npi, current_guess_target: npi === 0 ? 1 : 0 });
        return;
      }
      await updateLobby({ current_guess_target: nt });
    }
  };

  const handleGuess = async (targetId: string, personality: string) => {
    if (!myPlayerId) return;
    const cp = players.find(p => p.id === myPlayerId);
    if (cp) {
      // Update the player's guesses (now using personality strings)
      const updatedGuesses = { ...cp.guesses, [targetId]: personality };
      await updatePlayer(myPlayerId, { guesses: updatedGuesses });
      
      // Manually advance the turn logic here instead of relying on handleNextPhase
      await advanceTurnAfterGuess(targetId);
    }
  };

  const advanceTurnAfterGuess = async (targetId: string) => {
    if (!lobby || !players.length) return;
    
    const currentPlayer = players[lobby.current_player_index];
    const currentPlayerWithGuess = { ...currentPlayer, guesses: { ...currentPlayer.guesses, [targetId]: currentPlayer.guesses[targetId] || 'guessed' } };
    
    let nextTarget = lobby.current_guess_target;
    
    // Find next valid target (skip self and already guessed players)
    while (nextTarget < players.length && 
           (nextTarget === lobby.current_player_index || 
            currentPlayerWithGuess.guesses[players[nextTarget].id])) {
      nextTarget++;
    }
    
    if (nextTarget >= players.length) {
      // Current player has guessed everyone, move to next player
      const nextPlayerIndex = lobby.current_player_index + 1;
      
      if (nextPlayerIndex >= players.length) {
        // All players have finished guessing, calculate scores and end game
        for (const p of players) {
          let score = 0;
          Object.entries(p.guesses).forEach(([tid, g]) => { 
            const t = players.find(x => x.id === tid); 
            // Compare guessed personality with target's role (personality)
            if (t && g === t.role) score++; 
          });
          await updatePlayer(p.id, { score });
        }
        await updateLobby({ current_phase: 'results', status: 'completed' });
        return;
      }
      
      // Move to next player
      const nextValidTarget = nextPlayerIndex === 0 ? 1 : 0;
      await updateLobby({ current_player_index: nextPlayerIndex, current_guess_target: nextValidTarget });
    } else {
      // Move to next target for current player
      await updateLobby({ current_guess_target: nextTarget });
    }
  };

  const handleAssetSelect = async (asset: { type: 'image' | 'video' | 'document'; name: string; url: string; presentedBy: string; presentedAt: string }) => {
    if (!lobby) return;
    await updateLobby({ 
      current_displayed_asset: asset as any 
    });
  };

  const handleAssetRemove = async () => {
    if (!lobby) return;
    await updateLobby({ 
      current_displayed_asset: null as any
    });
  };

  if (!lobby || !players.length) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading...</p></div>;
  if (lobby.status === 'waiting') return <LobbyWaiting lobby={lobby} players={players} myPlayerId={myPlayerId} onStartGame={handleStartGame} onUpdateSettings={handleUpdateSettings} onUpdateScenario={handleUpdateScenario} />;

  const inCall = lobby.status === 'waiting' || lobby.status === 'in_progress';
  const isRoleplayPhase = lobby.current_phase === 'roleplay';
  const myPlayer = players.find(p => p.id === myPlayerId);
  const isMyTurn = myPlayer?.id === players[lobby.current_player_index]?.id;
  const hostPlayer = players.find(p => p.player_number === 1);
  const isHost = hostPlayer?.id === myPlayerId;

  const wrap = (node: ReactNode) => (
    <CallProvider lobbyCode={lobby.code} lobbyId={lobby.id} players={players} myPlayerId={myPlayerId} inCall={inCall} isRoleplayPhase={isRoleplayPhase}>
      {node}
    </CallProvider>
  );

  if (lobby.status === 'waiting') return wrap(<LobbyWaiting lobby={lobby} players={players} myPlayerId={myPlayerId} onStartGame={handleStartGame} onUpdateSettings={handleUpdateSettings} />);
  if (lobby.current_phase === 'roleSelection') return wrap(<RoleSelection lobby={lobby} players={players} myPlayerId={myPlayerId} updatePlayer={updatePlayer} updateLobby={updateLobby} />);
  if (lobby.current_phase === 'roleReveal') return wrap(<RoleReveal players={players} myPlayerId={myPlayerId} onNext={handleNextPhase} />);
  if (lobby.current_phase === 'roleplay') {
    const scenarioIndex = lobby.scenario_index ?? 0;
    const selectedScenario = BASE_SCENARIOS[scenarioIndex];
    return <RoleplayTimer 
      lobby={lobby} 
      isHost={isHost} 
      onTimerEnd={handleNextPhase}
      scenarioDescription={selectedScenario?.description}
      players={players}
      myPlayerId={myPlayerId}
      onAssetSelect={handleAssetSelect}
      onAssetRemove={handleAssetRemove}
    />;
  }
  if (lobby.current_phase === 'guessing') {
    const scenarioIndex = lobby.scenario_index ?? 0;
    const selectedScenario = BASE_SCENARIOS[scenarioIndex];
    const availablePersonalities = selectedScenario?.roles.map(r => r.personality) || [];
    return wrap(<GuessingPhase lobby={lobby} players={players} myPlayerId={myPlayerId} isMyTurn={!!isMyTurn} onGuess={handleGuess} onNext={handleNextPhase} availablePersonalities={availablePersonalities} />);
  }
  if (lobby.current_phase === 'results') return wrap(<Results players={players} onReset={() => navigate('/')} />);
  return null;
};

export default Lobby;
