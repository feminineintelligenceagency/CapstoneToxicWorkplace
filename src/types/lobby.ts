import type { TranscriptionEntry } from "@/types/call";

export interface DisplayedAsset {
  url: string;
  name: string;
  type: "image" | "video" | "audio" | "document" | "link";
  presentedBy: string; // player ID who selected it
  presentedAt: string; // ISO timestamp
}

export interface Lobby {
  id: string;
  code: string;
  host_id: string;
  status: "waiting" | "in_progress" | "completed";
  num_players: number;
  current_phase:
    | "setup"
    | "roleSelection"
    | "roleReveal"
    | "roleplay"
    | "guessing"
    | "grading"
    | "results";
  roleplay_timer_end?: string;
  roleplay_timer_duration?: number; // in minutes
  current_player_index: number;
  current_guess_target: number;
  scenario_index?: number; // Legacy field, retained for backward compatibility
  scenario_id?: string; // Supabase scenario ID
  current_displayed_asset?: DisplayedAsset | null; // Asset displayed during roleplay phase
  roleplay_scoring_started_at?: string | null;
  roleplay_scoring_completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LobbyPlayer {
  id: string;
  lobby_id: string;
  player_number: number;
  player_name: string;
  role: string | null;
  role_description: string;
  nicknames: string;
  guidelines: string[];
  ranked_choices?: string[];
  guesses: Record<string, string>;
  // Back-compat: `score` is the overall score shown in the UI.
  score: number;
  guess_score: number;
  role_score: number;
  overall_score: number;
  roleplaySummary?: string; // Optional LLM-generated summary for results display
  transcripts: TranscriptionEntry[];
  ready_for_roleplay: boolean;
  joined_at: string;
}
