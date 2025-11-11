export interface Lobby {
  id: string;
  code: string;
  host_id: string;
  status: "waiting" | "in_progress" | "completed";
  num_players: number;
  current_phase: "setup" | "roleReveal" | "roleplay" | "guessing" | "results";
  roleplay_timer_end?: string;
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
  guesses: Record<string, string>;
  score: number;
  joined_at: string;
}
