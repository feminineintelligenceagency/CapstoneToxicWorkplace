import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLobby } from "@/hooks/useLobby";
import { useScenarios } from "@/hooks/useScenarios";
import { useTranscription } from "@/hooks/useTranscription";
import { prepareTranscriptsForGrading } from "@/llm/prepareTranscriptsForGrading";
import { gradeRoleplayTranscripts } from "@/llm/gradeRoleplayTranscripts";
import { LobbyWaiting } from "@/components/LobbyWaiting";
import { RoleReveal } from "@/components/RoleReveal";
import { RoleplayTimer } from "@/components/RoleplayTimer";
import { GuessingPhase } from "@/components/GuessingPhase";
import { Results } from "@/components/Results";
import RoleSelection from "@/components/RoleSelection";
import { CallProvider } from "@/contexts/CallContext";
import type { TranscriptionEntry } from "@/types/call";
import { mergeTranscriptionEntries } from "@/lib/mergeTranscriptionEntries";

/** Push local mic transcripts to Supabase without wiping older lines synced earlier in roleplay. */
async function mergeTranscriptsIntoRow(
  playerId: string,
  local: TranscriptionEntry[],
): Promise<TranscriptionEntry[]> {
  const { data: row } = await supabase
    .from("lobby_players")
    .select("*")
    .eq("id", playerId)
    .maybeSingle();
  const raw = (row as { transcripts?: unknown } | null)?.transcripts;
  const server = Array.isArray(raw) ? (raw as TranscriptionEntry[]) : [];
  return mergeTranscriptionEntries([server, local]);
}

const ROLEPLAY_TRANSCRIPT_SYNC_MS = 12_000;

const Lobby = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { lobby, players, myPlayerId, updateLobby, updatePlayer } = useLobby(code);
  const { scenarios, loading: scenariosLoading } = useScenarios();

  const isRoleplayPhaseNow = lobby?.current_phase === "roleplay";
  const { getTranscriptions, clearTranscriptions, ensureRecognitionStarted } = useTranscription(
    isRoleplayPhaseNow,
    myPlayerId,
  );

  const [gradingError, setGradingError] = useState<string | null>(null);
  const [gradeSummaries, setGradeSummaries] = useState<Record<string, string>>({});
  const [gradeRoleScores, setGradeRoleScores] = useState<Record<string, number>>({});
  const transcriptUploadedRef = useRef(false);
  const gradingStartedRef = useRef(false);

  useEffect(() => {
    if (!code) navigate("/");
  }, [code, navigate]);

  const hostPlayer = players.find((p) => p.player_number === 1);
  const isHost = hostPlayer?.id === myPlayerId;
  const lobbyId = lobby?.id;
  const lobbyScenarioId = lobby?.scenario_id;

  useEffect(() => {
    if (lobby?.current_phase === "roleplay") {
      transcriptUploadedRef.current = false;
      return;
    }

    if (
      lobby?.current_phase === "guessing" &&
      myPlayerId &&
      !transcriptUploadedRef.current
    ) {
      transcriptUploadedRef.current = true;
      (async () => {
        try {
          const local = getTranscriptions();
          const merged = await mergeTranscriptsIntoRow(myPlayerId, local);
          await updatePlayer(myPlayerId, { transcripts: merged });
          clearTranscriptions();
        } catch (e) {
          transcriptUploadedRef.current = false;
          console.error("Transcript upload failed:", e);
        }
      })();
    }
  }, [lobby?.current_phase, myPlayerId, updatePlayer, getTranscriptions, clearTranscriptions]);

  // Each client only transcribes their own mic; periodically sync so a late empty upload cannot wipe earlier lines.
  useEffect(() => {
    if (lobby?.current_phase !== "roleplay" || !myPlayerId) return;

    const sync = async () => {
      try {
        const local = getTranscriptions();
        if (local.length === 0) return;
        const merged = await mergeTranscriptsIntoRow(myPlayerId, local);
        await updatePlayer(myPlayerId, { transcripts: merged });
      } catch (e) {
        console.warn("Roleplay transcript sync failed:", e);
      }
    };

    const id = window.setInterval(sync, ROLEPLAY_TRANSCRIPT_SYNC_MS);
    return () => window.clearInterval(id);
  }, [lobby?.current_phase, myPlayerId, getTranscriptions, updatePlayer]);

  useEffect(() => {
    if (lobby?.current_phase !== "grading") {
      gradingStartedRef.current = false;
      setGradingError(null);
      return;
    }
    if (!isHost || gradingStartedRef.current || !lobbyId) return;

    gradingStartedRef.current = true;

    const runGrading = async () => {
      try {
        const { data: latestPlayers } = await supabase
          .from("lobby_players")
          .select("*")
          .eq("lobby_id", lobbyId)
          .order("player_number", { ascending: true });

        const rows = (latestPlayers ?? []) as unknown as {
          id: string;
          player_number: number;
          player_name: string;
          role: string | null;
          role_description: string | null;
          nicknames: string | null;
          guidelines: unknown;
          ranked_choices: unknown;
          guesses: unknown;
          transcripts: unknown;
          guess_score: number | null;
          role_score: number | null;
          overall_score: number | null;
          score: number | null;
        }[];

        const selectedScenario = scenarios.find((s) => s.id === lobbyScenarioId);
        const gradingPlayers: typeof players = rows.map((row) => {
          const guidelines = Array.isArray(row.guidelines)
            ? (row.guidelines as string[])
            : [];
          const ranked_choices = Array.isArray(row.ranked_choices)
            ? (row.ranked_choices as string[])
            : undefined;
          const guesses =
            typeof row.guesses === "object" && row.guesses !== null
              ? (row.guesses as Record<string, string>)
              : {};
          const transcripts = Array.isArray(row.transcripts)
            ? (row.transcripts as unknown as TranscriptionEntry[])
            : [];

          const guess_score = row.guess_score ?? 0;
          const role_score = row.role_score ?? 0;
          const overall_score = row.overall_score ?? row.score ?? 0;

          return {
            id: row.id,
            lobby_id: lobbyId,
            player_number: row.player_number,
            player_name: row.player_name,
            role: row.role,
            role_description: row.role_description ?? "",
            nicknames: row.nicknames ?? "",
            guidelines,
            ranked_choices,
            guesses,
            score: row.score ?? overall_score,
            guess_score,
            role_score,
            overall_score,
            transcripts,
            ready_for_roleplay: false,
            joined_at: new Date().toISOString(),
          } as typeof players[number];
        });

        const gradingPayload = prepareTranscriptsForGrading(
          gradingPlayers,
          {
            scenarioName: selectedScenario?.scenario_name,
            scenarioDescription: selectedScenario?.description,
            roleScoreWeight: Number(import.meta.env.VITE_LLM_ROLE_SCORE_WEIGHT ?? "1"),
          },
        );

        const grading = await gradeRoleplayTranscripts(gradingPayload);

        const guessScores: Record<string, number> = {};
        for (const p of gradingPlayers) {
          let guessScore = 0;
          Object.entries(p.guesses).forEach(([tid, g]) => {
            const t = gradingPlayers.find((x) => x.id === tid);
            if (t && g === t.role) guessScore++;
          });
          guessScores[p.id] = guessScore;
        }

        const summaries: Record<string, string> = {};
        const roleScores: Record<string, number> = {};
        for (const gp of grading.players) {
          if (gp.playerId) {
            summaries[gp.playerId] =
              gp.playerSummary ??
              "No LLM roleplay summary was provided for this player.";
            roleScores[gp.playerId] = gp.roleScore ?? 0;
          }
        }
        setGradeSummaries(summaries);
        setGradeRoleScores(roleScores);

        for (const p of players) {
          const graded = grading.players.find((x) => x.playerId === p.id);
          const roleScore = graded?.roleScore ?? 0;
          const guessScore = guessScores[p.id] ?? 0;
          const overallScore = guessScore + roleScore;
          await updatePlayer(p.id, {
            guess_score: guessScore,
            role_score: roleScore,
            overall_score: overallScore,
            score: overallScore,
            // @ts-expect-error: roleplay_summary exists in DB migration but not yet in generated types
            roleplay_summary:
              graded?.playerSummary ??
              summaries[p.id] ??
              p.roleplaySummary ??
              null,
          });
        }

        await updateLobby({ current_phase: "results", status: "completed" });
      } catch (err) {
        console.error("LLM grading failed:", err);
        setGradingError(String(err));
        await updateLobby({ current_phase: "results", status: "completed" });
      }
    };

    runGrading();
  }, [lobby?.current_phase, lobbyId, lobbyScenarioId, isHost, players, scenarios, updateLobby, updatePlayer]);

  const handleStartGame = async (selectedScenarioId?: string) => {
    if (!lobby || players.length < 2) return;
    let scenarioId = selectedScenarioId ?? lobby.scenario_id;
    if (!scenarioId) {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      scenarioId = randomScenario?.id;
    }
    if (!scenarioId) return;

    await updateLobby({
      status: "in_progress",
      current_phase: "roleSelection",
      current_player_index: 0,
      scenario_id: scenarioId,
    });
  };

  const handleUpdateSettings = async (settings: { roleplay_timer_duration: number }) => {
    if (!lobby) return;
    await updateLobby({ roleplay_timer_duration: settings.roleplay_timer_duration });
  };

  const handleUpdateScenario = async (scenarioId: string) => {
    if (!lobby) return;
    await updateLobby({ scenario_id: scenarioId });
  };

  const finalizeGuessing = async () => {
    if (!lobby) return;

    // IMPORTANT: Re-fetch latest players from Supabase so we score based on the
    // actual, most recent guesses from every client (avoids host race conditions).
    const { data: latestPlayers } = await supabase
      .from("lobby_players")
      .select("*")
      .eq("lobby_id", lobby.id)
      .order("player_number", { ascending: true });

    const rows = (latestPlayers ?? []) as {
      id: string;
      guesses: Record<string, string> | null;
      role: string | null;
    }[];

    for (const row of rows) {
      let guessScore = 0;
      const guesses = row.guesses ?? {};
      Object.entries(guesses).forEach(([tid, g]) => {
        const target = rows.find((x) => x.id === tid);
        if (target && g === target.role) guessScore++;
      });

      await updatePlayer(row.id, {
        guess_score: guessScore,
        role_score: 0,
        overall_score: guessScore,
        score: guessScore,
      });
    }

    // Let in-flight transcript merges from clients finish before the host reads rows for grading.
    await new Promise((r) => setTimeout(r, 1500));

    await updateLobby({ current_phase: "grading", status: "in_progress" });
  };

  const handleNextPhase = async () => {
    if (!lobby || !players.length) return;

    if (lobby.current_phase === "roleReveal") {
      const durationMinutes = lobby.roleplay_timer_duration || 5;
      const timerEnd = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      await updateLobby({ current_phase: "roleplay", roleplay_timer_end: timerEnd });
      return;
    }

    if (lobby.current_phase === "roleplay") {
      await updateLobby({ current_phase: "guessing", current_player_index: 0, current_guess_target: 1 });
      return;
    }

    if (lobby.current_phase === "guessing") {
      const cp = players[lobby.current_player_index];
      let nt = lobby.current_guess_target;
      while (nt < players.length && (nt === lobby.current_player_index || cp.guesses[players[nt].id])) nt++;

      if (nt >= players.length) {
        const npi = lobby.current_player_index + 1;
        if (npi >= players.length) {
          await finalizeGuessing();
          return;
        }
        await updateLobby({ current_player_index: npi, current_guess_target: npi === 0 ? 1 : 0 });
        return;
      }

      await updateLobby({ current_guess_target: nt });
    }
  };

  const handleGuess = async (targetId: string, personality: string) => {
    if (!myPlayerId || !lobby || !players.length) return;
    const cp = players.find((p) => p.id === myPlayerId);
    if (!cp) return;

    const updatedGuesses = { ...cp.guesses, [targetId]: personality };
    await updatePlayer(myPlayerId, { guesses: updatedGuesses });

    const currentPlayer = players[lobby.current_player_index];
    const currentPlayerWithGuess = {
      ...currentPlayer,
      guesses: { ...currentPlayer.guesses, [targetId]: personality },
    };

    let nextTarget = lobby.current_guess_target;
    while (
      nextTarget < players.length &&
      (nextTarget === lobby.current_player_index ||
        currentPlayerWithGuess.guesses[players[nextTarget].id])
    ) {
      nextTarget++;
    }

    if (nextTarget >= players.length) {
      const nextPlayerIndex = lobby.current_player_index + 1;
      if (nextPlayerIndex >= players.length) {
        await finalizeGuessing();
        return;
      }
      await updateLobby({
        current_player_index: nextPlayerIndex,
        current_guess_target: nextPlayerIndex === 0 ? 1 : 0,
      });
      return;
    }

    await updateLobby({ current_guess_target: nextTarget });
  };

  const handleAssetSelect = async (asset: {
    type: "image" | "video" | "audio" | "document" | "link";
    name: string;
    url: string;
    presentedBy: string;
    presentedAt: string;
  }) => {
    if (!lobby) return;
    await updateLobby({ current_displayed_asset: asset });
  };

  const handleAssetRemove = async () => {
    if (!lobby) return;
    await updateLobby({ current_displayed_asset: null });
  };

  const handleReady = async (isReady: boolean) => {
    if (!myPlayerId) return;
    await updatePlayer(myPlayerId, { ready_for_roleplay: isReady });
  };

  if (!lobby || !players.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (scenariosLoading && scenarios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading scenarios...</p>
      </div>
    );
  }

  const inCall = lobby.status === "waiting" || lobby.status === "in_progress";
  const isRoleplayPhase = lobby.current_phase === "roleplay";
  const myPlayer = players.find((p) => p.id === myPlayerId);
  const isMyTurn = myPlayer?.id === players[lobby.current_player_index]?.id;

  const wrap = (node: ReactNode) => (
    <CallProvider
      lobbyCode={lobby.code}
      lobbyId={lobby.id}
      players={players}
      myPlayerId={myPlayerId}
      inCall={inCall}
      getTranscriptions={getTranscriptions}
      clearTranscriptions={clearTranscriptions}
      ensureTranscriptionStarted={ensureRecognitionStarted}
    >
      {node}
    </CallProvider>
  );

  if (lobby.status === "waiting") {
    return wrap(
      <LobbyWaiting
        lobby={lobby}
        players={players}
        myPlayerId={myPlayerId}
        scenarios={scenarios}
        onStartGame={handleStartGame}
        onUpdateSettings={handleUpdateSettings}
        onUpdateScenario={handleUpdateScenario}
      />,
    );
  }

  if (lobby.current_phase === "roleSelection") {
    return wrap(
      <RoleSelection
        lobby={lobby}
        players={players}
        myPlayerId={myPlayerId}
        scenarios={scenarios}
        updatePlayer={updatePlayer}
        updateLobby={updateLobby}
      />,
    );
  }

  if (lobby.current_phase === "roleReveal") {
    return wrap(
      <RoleReveal
        players={players}
        myPlayerId={myPlayerId}
        onNext={handleNextPhase}
        onReady={handleReady}
      />,
    );
  }

  if (lobby.current_phase === "roleplay") {
    const selectedScenario = scenarios.find((scenario) => scenario.id === lobby.scenario_id);
    return wrap(
      <RoleplayTimer
        lobby={lobby}
        players={players}
        isHost={!!isHost}
        onTimerEnd={handleNextPhase}
        scenarioDescription={selectedScenario?.description || ""}
        myPlayerId={myPlayerId}
        onAssetSelect={handleAssetSelect}
        onAssetRemove={handleAssetRemove}
      />,
    );
  }

  if (lobby.current_phase === "guessing") {
    const selectedScenario = scenarios.find((scenario) => scenario.id === lobby.scenario_id);
    const availablePersonalities = selectedScenario?.roles.map((r) => r.personality) || [];
    return wrap(
      <GuessingPhase
        lobby={lobby}
        players={players}
        myPlayerId={myPlayerId}
        isMyTurn={!!isMyTurn}
        onGuess={handleGuess}
        onNext={handleNextPhase}
        availablePersonalities={availablePersonalities}
      />,
    );
  }

  if (lobby.current_phase === "grading") {
    return wrap(
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Grading roleplay with LLM...</p>
          {gradingError ? <p className="text-sm text-destructive mt-2">{gradingError}</p> : null}
        </div>
      </div>,
    );
  }

  if (lobby.current_phase === "results") {
    const playersWithSummaries = players.map((p) => ({
      ...p,
      role_score: gradeRoleScores[p.id] ?? p.role_score,
      overall_score:
        (p.guess_score ?? 0) + (gradeRoleScores[p.id] ?? p.role_score ?? 0),
      score:
        (p.guess_score ?? 0) + (gradeRoleScores[p.id] ?? p.role_score ?? 0),
      roleplaySummary: gradeSummaries[p.id] ?? p.roleplaySummary,
    }));
    return wrap(<Results players={playersWithSummaries} onReset={() => navigate("/")} />);
  }

  return null;
};

export default Lobby;
