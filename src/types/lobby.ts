export interface Lobby {
  id: string;
  code: string;
  host_id: string;
  status: "waiting" | "in_progress" | "completed";
  num_players: number;
  current_phase: "setup" | "roleSelection" | "roleReveal" | "roleplay" | "guessing" | "results";
  roleplay_timer_end?: string;
  roleplay_timer_duration?: number; // in minutes
  current_player_index: number;
  current_guess_target: number;
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
  joined_at: string;
}
