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
    | "results";
  roleplay_timer_end?: string;
  roleplay_timer_duration?: number; // in minutes
  current_player_index: number;
  current_guess_target: number;
  scenario_index?: number; // Legacy field, retained for backward compatibility
  scenario_id?: string; // Supabase scenario ID
  current_displayed_asset?: DisplayedAsset; // Asset displayed during roleplay phase
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
  guidelines: readonly string[];
  ranked_choices?: string[];
  guesses: Record<string, string>;
  score: number;
  ready_for_roleplay: boolean;
  joined_at: string;
}
