export const BASE_ROLES = [
  'Detective',
  'Villager',
  'Doctor',
  'Thief',
  'Prophet',
  'Bodyguard',
  'Seer'
] as const;

export type Role = typeof BASE_ROLES[number];

export interface Player {
  id: number;
  name: string;
  role: Role;
  guesses: Record<number, Role>;
  score: number;
}

export type GamePhase = 'setup' | 'roleReveal' | 'guessing' | 'results';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentGuessTarget: number;
}
