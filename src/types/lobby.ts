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
    | "guessing"
    | "results";
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
  ranked_choices?: string[];
  guesses: Record<string, string>;
  score: number;
  joined_at: string;
}
