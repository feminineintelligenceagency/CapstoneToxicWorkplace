import type { LobbyPlayer } from "@/types/lobby";
import type { TranscriptionEntry } from "@/types/call";

export type GradingPlayerInput = {
  playerId: string;
  playerName: string;
  rolePersonality: string | null;
  roleName: string | null;
  roleDescription: string;
  roleGuidelines: readonly string[];
  utterances: Array<Pick<TranscriptionEntry, "timestamp" | "text">>;
};

export type GradingPayload = {
  scenario: {
    scenarioName?: string;
    scenarioDescription?: string;
  };
  players: GradingPlayerInput[];
  conversation: Array<{
    timestamp: number;
    playerId: string;
    playerName: string;
    text: string;
  }>;
  scoringConfig: {
    roleScoreWeight: number;
  };
};

const DEFAULT_MAX_UTTERANCES_PER_PLAYER = 80;
const DEFAULT_MAX_CONVERSATION_TURNS = 220;
const DEFAULT_MAX_UTTERANCE_CHARS = 260;
const DEFAULT_MAX_TOTAL_CONVERSATION_CHARS = 90000;

const trimUtterance = (text: string) => {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > DEFAULT_MAX_UTTERANCE_CHARS ? `${t.slice(0, DEFAULT_MAX_UTTERANCE_CHARS)}…` : t;
};

export function prepareTranscriptsForGrading(
  players: LobbyPlayer[],
  opts?: {
    scenarioName?: string;
    scenarioDescription?: string;
    roleScoreWeight?: number;
    maxUtterancesPerPlayer?: number;
    maxConversationTurns?: number;
  },
): GradingPayload {
  const roleScoreWeight = opts?.roleScoreWeight ?? 1;
  const maxUtterancesPerPlayer = opts?.maxUtterancesPerPlayer ?? DEFAULT_MAX_UTTERANCES_PER_PLAYER;
  const maxConversationTurns = opts?.maxConversationTurns ?? DEFAULT_MAX_CONVERSATION_TURNS;

  const playersWithUtterances: GradingPlayerInput[] = players.map((p) => {
    const utterances = (p.transcripts ?? [])
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, maxUtterancesPerPlayer)
      .map((u) => ({
        timestamp: u.timestamp,
        text: trimUtterance(u.text),
      }))
      .filter((u) => u.text.length > 0);

    return {
      playerId: p.id,
      playerName: p.player_name,
      rolePersonality: p.role ?? null,
      roleName: p.nicknames ?? null,
      roleDescription: p.role_description ?? "",
      roleGuidelines: p.guidelines ?? [],
      utterances,
    };
  });

  // Build a merged conversation transcript for interaction scoring.
  const conversation = playersWithUtterances
    .flatMap((p) => p.utterances.map((u) => ({ ...u, playerId: p.playerId, playerName: p.playerName })))
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, maxConversationTurns);

  // Extra guardrail to avoid huge prompts.
  let totalChars = 0;
  const conversationClipped: typeof conversation = [];
  for (const turn of conversation) {
    totalChars += turn.text.length;
    if (totalChars > DEFAULT_MAX_TOTAL_CONVERSATION_CHARS) break;
    conversationClipped.push(turn);
  }

  return {
    scenario: {
      scenarioName: opts?.scenarioName,
      scenarioDescription: opts?.scenarioDescription,
    },
    players: playersWithUtterances,
    conversation: conversationClipped,
    scoringConfig: { roleScoreWeight },
  };
}

