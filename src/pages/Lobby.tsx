import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLobby } from '@/hooks/useLobby';
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

  useEffect(() => { if (!code) navigate('/'); }, [code, navigate]);

  const handleStartGame = async () => {
    if (!lobby || players.length < 2) return;
    // Move game into the role selection phase where players submit ranked ballots.
    await updateLobby({
      status: "in_progress",
      current_phase: "roleSelection",
      current_player_index: 0,
    });
  };

  const handleUpdateSettings = async (settings: {roleplay_timer_duration: number}) => {
    if (!lobby) return;
    await updateLobby({ roleplay_timer_duration: settings.roleplay_timer_duration });
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

  if (!lobby || !players.length) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Loading...</p></div>;
  if (lobby.status === 'waiting') return <LobbyWaiting lobby={lobby} players={players} myPlayerId={myPlayerId} onStartGame={handleStartGame} onUpdateSettings={handleUpdateSettings} />;

  const myPlayer = players.find(p => p.id === myPlayerId);
  const isMyTurn = myPlayer?.id === players[lobby.current_player_index]?.id;
  const hostPlayer = players.find(p => p.player_number === 1);
  const isHost = hostPlayer?.id === myPlayerId;

  if (lobby.current_phase === "roleSelection")
    return (
      <RoleSelection
        lobby={lobby}
        players={players}
        myPlayerId={myPlayerId}
        updatePlayer={updatePlayer}
        updateLobby={updateLobby}
      />
    );
  if (lobby.current_phase === 'roleReveal') return <RoleReveal players={players} myPlayerId={myPlayerId} onNext={handleNextPhase} />;
  if (lobby.current_phase === 'roleplay') return <RoleplayTimer lobby={lobby} isHost={isHost} onTimerEnd={handleNextPhase} />;
  if (lobby.current_phase === 'guessing') {
    // first scenario is defaulted here for now
    const selectedScenario = BASE_SCENARIOS[0];
    const availablePersonalities = selectedScenario?.roles.map(r => r.personality) || [];
    return <GuessingPhase lobby={lobby} players={players} myPlayerId={myPlayerId} isMyTurn={isMyTurn} onGuess={handleGuess} onNext={handleNextPhase} availablePersonalities={availablePersonalities} />;
  }
  if (lobby.current_phase === 'results') return <Results players={players} onReset={() => navigate('/')} />;
  return null;
};

export default Lobby;
